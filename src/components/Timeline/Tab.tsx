import { 
  useContext, 
  useState,
  useEffect,  
} from "react";
import { TeamsFxContext } from "../Context";
import { Client } from "@microsoft/microsoft-graph-client";
import {
  useTeams,
  useGraphWithCredential
} from "@microsoft/teamsfx-react";
import { 
  PrimaryButton,
  Checkbox, 
  Dropdown, 
  IDropdownOption, 
  Stack
  
} from '@fluentui/react';
import { Spinner} from '@fluentui/react-components';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { 
  PlannerTask,
  PlannerBucket
} from '@microsoft/microsoft-graph-types'
import { IFilterSettings, ITimeLineData } from "../../models"
import { 
  TimeLineService,  
  ITimeLineService,
  IFilterService,
  FilterService
  
} from "../../services";
import { TimelineItem } from '..';
import {
  pagepaddingStyle,
  errorStyle,
  planTitleStyle,  
  spinnerStyle,
  timelineHeaderStyle,
  timelineYearStyle,
  activeTaskscheckbox, 
  refreshTaskscheckbox,
  dropdownStyles, 
  stackStyles,
} from '../../Styles';

export default function Tab() {
  // get context from useTeams
  const [{ context }] = useTeams();

  initializeIcons();

  // scopes
  const scopes = ['User.Read.All', 'Tasks.Read', 'Tasks.ReadWrite', 'TeamSettings.Read.All'];
  
  // states
  const [graphClient, setGraphClient] = useState<Client | undefined>(undefined);
  const [timelineService, setTimeLineService] = useState<ITimeLineService | undefined>(undefined);
  const [groupId, setGroupId] = useState('');
  const [timeLineData, setTimeLineData] = useState<ITimeLineData | undefined>(undefined);
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [bucketName, setBucketName] = useState<string>("For all buckets");
  const [retrievingTasks, setRetrievingTasks] = useState(true);
  const [bucketOptions, setBucketOptions ] = useState<IDropdownOption[]>([]);
  const filterService: IFilterService = new FilterService( {bucketId: "All", showActiveTasks: true});
    
  const [filterSettings, setFilterSettings] = useState<IFilterSettings>({bucketId: "All", showActiveTasks: false});
  const [bucketId, setBucketId] = useState<string>("");
  const [showActiveTasks, setShowActiveTasks] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  
  const { teamsUserCredential, renderSettings } = useContext(TeamsFxContext);

  const onDropDownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
    // Set the bucket id
    if (option) {
      // Set the bucket id
      setBucketId(option.key.toString());

      // Set the retrieving tasks flag
      if (filterService) {
        filterService.saveFilterSettings({
          bucketId: option.key.toString(),
          showActiveTasks: showActiveTasks
        });
      }

      // Set the filter settings
      setFilterSettings({bucketId: option.key.toString(), showActiveTasks: showActiveTasks});

      if (option.key === 'All') {
        // Set the bucket name
        setBucketName("For all buckets");
      } else {
        // Set the bucket name
        setBucketName("For bucket: " + option.text);
      }
    }
  };

  // Set the bucket name when the bucket id changes
  useEffect(() => {
    if (bucketId === 'All') {
      // Set the bucket name
      setBucketName("For all buckets");
    } else {
      const name: string = renderSettings?.buckets.find((bucket) => bucket.id === bucketId)?.name || "Unknown Bucket";
      // Set the bucket name
      setBucketName("For bucket: " + name);
    }
  }, [filterSettings]);

  // Get the graph client
  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsUserCredential, scope) => {
      // Call graph api directly to get user profile information      
      const profile = await graph.api("/me").get();

      // Set the graph client
      setGraphClient(graph);

      // Return the profile
      return profile;
    }, { scope: scopes } );

  // Set the graph client
  useEffect(() => {
    // Check if the data is available
    if (context) {
      (async () => {        
        if (context?.team?.groupId)
          // Set the group id
          setGroupId(context?.team?.groupId);        
      })();

      const settings = filterService.getFilterSettings();

      // Set the filter settings
      setBucketId(settings.bucketId);
      setShowActiveTasks(settings.showActiveTasks);

      // Set the filter settings
      setFilterSettings({bucketId: settings.bucketId, showActiveTasks: settings.showActiveTasks});
    } 
  }, [context]);

  useEffect( () => {
    const fetchData = async () => {
      if (refreshData) {
        if (timelineService && renderSettings) {
          setTimeLineData(await timelineService.getTimelineData(refreshData));
                
          setTasks(timelineService.getTasks("dueDate"));
          
          renderSettings.buckets = timelineService.getBuckets();
          renderSettings.users = timelineService.getTaskUsers();

          setTasks(timelineService?.getTasksForBucket(filterSettings) ?? []);
          setRetrievingTasks(false);
          setRefreshData(false);
        }
      }
    };

    fetchData();
  }, [refreshData]);

  useEffect(() => {
    // Fetch the data
    const fetchData = async () => {
      // Check if the graph client is available
      if (graphClient) {
        // Create a new timeline service
        if (groupId) {
          // Check if the render settings are available
          if (renderSettings) {        
            // Set the render settings  
            renderSettings.renderYear =false;
            renderSettings.currentYear = 0;
            renderSettings.renderMonth = true;
            renderSettings.currentMonth = -1;
            
            // Check if the timeline service is available
            if (timelineService) {
              // Check if the render settings are available
              if (renderSettings.buckets.length > 0) {
                // Check if the tasks have been retrieved
                if (refreshData) {
                  // Set the retrieving tasks flag
                  setTimeLineData(await timelineService.getTimelineData(false));
                  
                  renderSettings.buckets = timelineService.getBuckets();
                  renderSettings.users = timelineService.getTaskUsers();                  
                } 
                  
                setTasks(timelineService.getTasksForBucket(filterSettings));                  
                renderSettings.lastRenderedDate = new Date();
              }
            } else { 
              // Create a new timeline service
              const timelineService: ITimeLineService = new TimeLineService(graphClient!, groupId);
              // Set the timeline service
              setTimeLineService(timelineService)

              const filterSettings: IFilterSettings = filterService.getFilterSettings();
              
              setTimeLineData(await timelineService.getTimelineData(false));
              
              setTasks(timelineService.getTasksForBucket(filterSettings));
              
              renderSettings.buckets = timelineService.getBuckets();
              renderSettings.users = timelineService.getTaskUsers();
              
              // Set the render settings
              setRetrievingTasks(false);              

              // Set the filter settings
              setBucketId(filterSettings.bucketId);
              // Set the show active tasks
              setShowActiveTasks(filterSettings.showActiveTasks);

            }
          }      
        }
      }
    };
  
    // Fetch the data
    fetchData();
    }, [graphClient, filterSettings]);

  // Update the bucket options when the render settings change
  useEffect(() => {
    // Add the default option
    const opt= [
      { key: 'All', text: 'All Buckets' },    
    ];

    // Add the buckets
    for (const bucket of renderSettings?.buckets ?? []) {
      // Add the bucket to the options
      opt.push({ key: bucket.id ?? 'unknown', text: bucket.name ?? 'Unnamed Bucket' });
    };

    // Set the options
    setBucketOptions(opt);
  }, [renderSettings?.buckets]);

  return (
    <div>
      { !graphClient && !loading &&
        <div>
          <p>Authorize to grant permission to access Planner Tasks.</p>
          <PrimaryButton text="Authorize" disabled={loading} onClick={reload} />          
        </div>
      }
      { graphClient &&
        <>
          <Stack enableScopedSelectors horizontal horizontalAlign="start" styles={stackStyles}>
            <Checkbox label="All Tasks" 
                      checked={showActiveTasks} 
                      boxSide="end"
                      styles={activeTaskscheckbox} 
                      onChange={(ev, checked) => { 
                        if (filterService) {
                          setShowActiveTasks(!showActiveTasks);
                          const fliters: IFilterSettings = { bucketId: bucketId, showActiveTasks: !showActiveTasks};
                          filterService.saveFilterSettings(fliters);                          
                          setFilterSettings(fliters);
                        }
                      }} />   
            <Dropdown placeholder="Select Plan Bucket"          
                      selectedKey={bucketId}
                      onChange={onDropDownChange}
                      options={bucketOptions}
                      styles={dropdownStyles} />
            <Checkbox label="Refresh Tasks" 
                      checked={refreshData} 
                      boxSide="end"
                      styles={refreshTaskscheckbox} 
                      onChange={(ev, checked) => { 
                          setRefreshData(!refreshData); 
                          setRetrievingTasks(!refreshData);
                        }} />   
          </Stack>
          <div>
            { retrievingTasks &&
              <div>
                <Spinner className={spinnerStyle} labelPosition="below"  label="Retrieving Tasks..."/>
              </div>
            }
            { !retrievingTasks &&      
              <div className={pagepaddingStyle}>
                { timeLineData?.error &&
                  <pre className={errorStyle}>Error: {timeLineData?.error}</pre>
                }        
                <div>
                  <div className={planTitleStyle}>
                    <span>{showActiveTasks ? "All Plannner Tasks" : "Active Planner Tasks"}</span>
                  </div>
                  <div style={{ paddingBottom: '10px', fontSize: '20px' }}>
                    {bucketName}
                  </div>
                  { tasks.map((task: PlannerTask) =>
                    <> 
                      <TimelineItem key={task.id} {...task}/>        
                    </>
                  )}                
                
                  <header className={timelineHeaderStyle}>
                    <span className={timelineYearStyle}>
                      { tasks.length > 0 ? "End" : tasks.length === 0 && "No Tasks" }
                    </span>
                  </header>                
                </div>
              </div>
            }
          </div>
        </>
      }
    </div>
  );
}
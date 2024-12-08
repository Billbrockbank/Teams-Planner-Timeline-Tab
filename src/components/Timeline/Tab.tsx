import { 
  useContext, 
  useState,
  useEffect,
  useRef
} from "react";
import { TeamsFxContext } from "../Context";
import { Client } from "@microsoft/microsoft-graph-client";
import {
  useTeams,
  useGraphWithCredential
} from "@microsoft/teamsfx-react";
import { Stack } from '@fluentui/react';
import {
  bundleIcon,
  CalendarMonthFilled,
  CalendarMonthRegular,  
} from "@fluentui/react-icons";
import {
  Button, 
  Spinner,
  ToggleButton, 
  Tooltip,
  Checkbox,
  Dropdown,
  Option,
  useId, 
  OptionOnSelectData, 
  SelectionEvents,
} from '@fluentui/react-components';
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
  TabStyles,
  pagepaddingStyle,
  errorStyle,
  planTitleStyle,  
  spinnerStyle,
  timelineHeaderStyle,
  timelineYearStyle,
  stackStyles,
  spinnerDiv,
} from '../../Styles';

export default function Tab() {
  // get context from useTeams
  const [{ context }] = useTeams();
  console.log("updated");

  initializeIcons();
  const CalendarMonth = bundleIcon(CalendarMonthFilled, CalendarMonthRegular);
  const dropdownId = useId("dropdown-bucket");

  // scopes
  const scopes = ['User.Read.All', 'Tasks.Read', 'Tasks.ReadWrite', 'TeamSettings.Read.All'];
  
  // states
  const graphClient = useRef<Client | undefined>(undefined);  
  const timelineService = useRef<ITimeLineService | undefined>(undefined);
  const groupId = useRef('');  
  const pageId = useRef<string>('');  
  const timeLineData = useRef<ITimeLineData | undefined>(undefined);
  
  const [tasks, setTasks] = useState<PlannerTask[]>([]);

  const [retrievingTasks, setRetrievingTasks] = useState(true);
  const filterService: IFilterService = new FilterService( {bucketId: "All", showActiveTasks: true});
  const [filterSettings, setFilterSettings] = useState<IFilterSettings>({bucketId: "All", showActiveTasks: true});
  
  const [bucketId, setBucketId] = useState<string>("");
  const [bucketName, setBucketName] = useState<string>("For all buckets");
  const [showActiveTasks, setShowActiveTasks] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  
  const { renderSettings } = useContext(TeamsFxContext);

  //const onDropDownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
  const onDropDownChange = ((event: SelectionEvents, data: OptionOnSelectData) => {
    // Set the bucket id
    if (data) {
      // Set the bucket id
      if (data.optionValue) {
        setBucketId(data.optionValue.toString());

        // Set the retrieving tasks flag
        if (filterService) {
          filterService.saveFilterSettings(pageId.current, {
            bucketId: data.optionValue.toString(),
            showActiveTasks: showActiveTasks
          });
        }

        // Set the filter settings
        setFilterSettings({bucketId: data.optionValue.toString(), showActiveTasks: showActiveTasks});

        if (data.optionText === 'All') {
          // Set the bucket name
          setBucketName("For all buckets");
        } else {
          // Set the bucket name
          setBucketName("For bucket: " + data.optionText);
        }
      }
    }
  });

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
      graphClient.current = graph;

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
          groupId.current = context?.team?.groupId;        
      })();

      pageId.current = context.page?.id ?? ''      

      const settings = filterService.getFilterSettings(pageId.current);

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
        if (timelineService.current && renderSettings) {
          timeLineData.current = await timelineService.current.getTimelineData(refreshData);
                
          setTasks(timelineService.current.getTasks("dueDate"));
          
          renderSettings.buckets = timelineService.current.getBuckets();
          renderSettings.users = timelineService.current.getTaskUsers();
          renderSettings.renderYear =false;
          renderSettings.currentYear = 0;
          renderSettings.renderMonth = true;
          renderSettings.currentMonth = -1;
          renderSettings.lastRenderedDate = new Date();

          setTasks(timelineService.current.getTasksForBucket(filterSettings) ?? []);
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
      if (graphClient.current) {
        // Create a new timeline service
        if (groupId.current !== '') {
          // Check if the render settings are available
          if (renderSettings) {        
            // Set the render settings  
            renderSettings.renderYear =false;
            renderSettings.currentYear = 0;
            renderSettings.renderMonth = true;
            renderSettings.currentMonth = -1;
            
            // Check if the timeline service is available
            if (timelineService.current) {
              // Check if the render settings are available
              if (renderSettings.buckets.length > 0) {
                // Check if the tasks have been retrieved
                if (refreshData) {
                  // Set the retrieving tasks flag
                  timeLineData.current = await timelineService.current.getTimelineData(false);
                  
                  renderSettings.buckets = timelineService.current.getBuckets();
                  renderSettings.users = timelineService.current.getTaskUsers();                  
                } 
                  
                setTasks(timelineService.current.getTasksForBucket(filterSettings));                  
                renderSettings.lastRenderedDate = new Date();
              }
            } else { 
              // Create a new timeline service
              // Set the timeline service
              timelineService.current = new TimeLineService(graphClient.current, groupId.current, pageId.current);
                            
              const filterSettings: IFilterSettings = filterService.getFilterSettings(pageId.current);
              
              timeLineData.current = await timelineService.current.getTimelineData(false);
              
              setTasks(timelineService.current.getTasksForBucket(filterSettings));
              
              renderSettings.buckets = timelineService.current.getBuckets();
              renderSettings.users = timelineService.current.getTaskUsers();

              if (filterSettings.bucketId === 'All') {
                   // Set the bucket name
                  setBucketName("For all buckets");
              } else {
                const buckets: PlannerBucket[] = timelineService.current.getBuckets();
                const name: string = buckets.find((bucket) => bucket.id === filterSettings.bucketId)?.name || "Unknown Bucket";                
                // Set the bucket name
                setBucketName("For bucket: " + name);
              }

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
  }, [graphClient.current, filterSettings]);

  return (
    <div>
      { !graphClient.current && !loading &&
        <div>
          <p>Authorize to grant permission to access Planner Tasks.</p>
          <Button appearance="primary" disabled={loading} onClick={reload} >
            Authorize
          </Button>          
        </div>
      }
      { graphClient.current &&
        <>
          <Stack enableScopedSelectors horizontal horizontalAlign="start" styles={stackStyles}>
            <div className="activeTaskscheckbox">              
              <Checkbox label="All Tasks" 
                        checked={showActiveTasks} 
                        labelPosition="before"
                        disabled={retrievingTasks}
                        onChange={(ev, checked) => { 
                          if (filterService) {
                            setShowActiveTasks(!showActiveTasks);
                            const filters: IFilterSettings = { bucketId: bucketId, showActiveTasks: !showActiveTasks};
                            filterService.saveFilterSettings(pageId.current, filters);                          
                            setFilterSettings(filters);
                          }
                        }} />   
            </div>
            <div>
              <label style={{ paddingRight: '5px', verticalAlign: "middle" }}>Planner Bucket</label>
              <Dropdown placeholder={bucketName ? bucketName.replace("For bucket: ", "").replace("For all buckets", "All Buckets") : "Select a bucket"} 
                        aria-labelledby={dropdownId}                        
                        onOptionSelect={onDropDownChange}
                        selectedOptions={[bucketId]}
                        defaultValue={bucketId}
                        disabled={retrievingTasks}
                        size="medium" >
                <Option key="All" value="All" text="All Buckets">All Buckets</Option>
                { renderSettings?.buckets.map((bucket: PlannerBucket) => (
                    <Option key={bucket.id} value={bucket.id} text={bucket.name ?? 'Unnamed Bucket'}>{bucket.name}</Option>
                ))}
              </Dropdown>
            </div>
            <Tooltip content="Refreah Timeline Tasks" relationship="label">
              <ToggleButton
                checked={refreshData}
                style={{ width: '30px', height: '30px', marginLeft: '5px' }}
                icon={<CalendarMonth />}
                appearance="subtle"
                disabled={retrievingTasks}
                onClick={() => {
                  setRefreshData(!refreshData); 
                  setRetrievingTasks(!refreshData);
                }}
              />
            </Tooltip>
          </Stack>
          <div>
            { retrievingTasks &&
              <div className={spinnerDiv}>
                <Spinner className={spinnerStyle} labelPosition="below"  label="Retrieving Tasks..."/>
              </div>
            }
            { !retrievingTasks &&      
              <div className={pagepaddingStyle}>
                { timeLineData.current?.error &&
                  <pre className={errorStyle}>Error: {timeLineData.current?.error}</pre>
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
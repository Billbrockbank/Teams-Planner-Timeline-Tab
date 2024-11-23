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
  const [timeLineData, settimeLineData] = useState<ITimeLineData | undefined>(undefined);
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [bucketName, setBucketName] = useState<string>("For all buckets");
  const [retrievingTasks, setRetrievingTasks] = useState(true);
  const [bucketOptions, setBucketOptions ] = useState<IDropdownOption[]>([]);
  const filterService: IFilterService = new FilterService( {bucketId: "All", showActiveTasks: true});
    
  const [filterSettings, setFilterSettings] = useState<IFilterSettings>({bucketId: "All", showActiveTasks: true});
  const [bucketId, setBucketId] = useState<string>("");
  const [showActiveTasks, setShowActiveTasks] = useState(false);
  
  const { teamsUserCredential, renderSettings } = useContext(TeamsFxContext);

  const onDropDownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
    if (option) {
      setBucketId(option.key.toString());

      if (filterService) {
        filterService.saveFilterSettings({
          bucketId: option.key.toString(),
          showActiveTasks: showActiveTasks
        });
      }

      setFilterSettings({bucketId: option.key.toString(), showActiveTasks: showActiveTasks});

      if (option.key === 'All') {
        setBucketName("For all buckets");
      } else {
        setBucketName("For bucket: " + option.text);
      }
    }
  };

  useEffect(() => {
    if (bucketId === 'All') {
      setBucketName("For all buckets");
    } else {
      const name: string = renderSettings?.buckets.find((bucket) => bucket.id === bucketId)?.name || "Unknown Bucket";
      setBucketName("For bucket: " + name);
    }
  }, [filterSettings]);

  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsUserCredential, scope) => {
      // Call graph api directly to get user profile information      
      const profile = await graph.api("/me").get();

      setGraphClient(graph);

      return profile;
    },
    { scope: scopes }
  );

  useEffect(() => {
    if (context) {
      (async () => {        
        if (context?.team?.groupId)
          setGroupId(context?.team?.groupId);        
      })();

      const settings = filterService.getFilterSettings();

      setBucketId(settings.bucketId);
      setShowActiveTasks(settings.showActiveTasks);

      setFilterSettings({bucketId: settings.bucketId, showActiveTasks: settings.showActiveTasks});
    } 
  }, [context]);

  useEffect(() => {
    if (graphClient) {
      if (groupId) {
        if (renderSettings) {          
          renderSettings.renderYear =false;
          renderSettings.currentYear = 0;
          renderSettings.renderMonth = true;
          renderSettings.currentMonth = -1;
          
          if (timelineService) {
            if (renderSettings.buckets.length > 0) {
              setTasks(timelineService.getTasksForBucket(filterSettings));

              renderSettings.lastRenderedDate = new Date();
            }
          } else { 
            (async () => {
              const timelineService: ITimeLineService = new TimeLineService(graphClient!, groupId);

              const filterSettings: IFilterSettings = filterService.getFilterSettings();
              
              setBucketId(filterSettings.bucketId);
              setShowActiveTasks(filterSettings.showActiveTasks);
              
              setTimeLineService(timelineService)

              settimeLineData(await timelineService.getTimelineData(false));
              
              setTasks(timelineService.getTasks("dueDate"));
              
              renderSettings.buckets = timelineService.getBuckets();
              renderSettings.users = timelineService.getTaskUsers();

              setRetrievingTasks(false);
              setFilterSettings({bucketId: filterSettings.bucketId, showActiveTasks: filterSettings.showActiveTasks});
            })();
          }
       }      
      }
    }
  }, [graphClient, filterSettings]);

  useEffect(() => {
    const opt= [
      { key: 'All', text: 'All Buckets' },    
    ];

    for (const bucket of renderSettings?.buckets ?? []) {
        opt.push({ key: bucket.id ?? 'unknown', text: bucket.name ?? 'Unnamed Bucket' });
    };

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
                          const fliters: IFilterSettings = { bucketId: bucketId, showActiveTasks: !showActiveTasks };
                          filterService.saveFilterSettings(fliters);                          
                          setFilterSettings(fliters);
                        }
                      }} />   
            <Dropdown placeholder="Select Plan Bucket"          
                      selectedKey={bucketId}
                      onChange={onDropDownChange}
                      options={bucketOptions}
                      styles={dropdownStyles} />
          </Stack>
          <div>        
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
                { retrievingTasks &&
                  <div>
                    <Spinner className={spinnerStyle} labelPosition="below"  label="Retrieving Tasks..."/>
                  </div>
                } 
                { !retrievingTasks &&
                  <header className={timelineHeaderStyle}>
                    <span className={timelineYearStyle}>
                      { tasks.length > 0 ? "End" : tasks.length === 0 && "No Tasks" }
                    </span>
                  </header>
                }
              </div>
            </div>
          </div>
        </>
      }
    </div>
  );
}
import { 
  useContext, 
  useState,
  useEffect,
  useRef,
  useMemo
} from "react";
import { TeamsFxContext } from "../Context";
import { Client } from "@microsoft/microsoft-graph-client";
import {
  useTeams,
  useGraphWithCredential
} from "@microsoft/teamsfx-react";
import {
  Button, 
  Spinner,  
} from '@fluentui/react-components';
import { PlannerTask } from '@microsoft/microsoft-graph-types'
import { ITimeLineData } from "../../models"
import { 
  TimeLineService,  
  ITimeLineService,
} from "../../services";
import { 
  TimelineItem,
  CommandBar,
} from '..';
import {
  pagePaddingStyle,
  errorStyle,
  planTitleStyle,  
  spinnerStyle,
  timelineHeaderStyle,
  timelineYearStyle,
  spinnerDiv,
  BucketNameStyle,
} from '../../Styles';

export default function Tab() {
  // get context from useTeams
  const [{ context }] = useTeams();
  
  const { renderSettings, configSettings, filterSettings } = useContext(TeamsFxContext);

  // scopes
  const scopes = ['User.Read.All', 'Tasks.Read', 'GroupMember.Read.All', 'Tasks.ReadWrite', 'TeamSettings.Read.All'];
  
  // states    
  const timeLineData = useRef<ITimeLineData | undefined>(undefined);
  
  const [graphClient, setGraphClient] = useState<Client>();
  const [tasks, setTasks] = useState<PlannerTask[]>([]);

  const [retrievingTasks, setRetrievingTasks] = useState(true);
  const [bucketId, setBucketId] = useState<string>("");
  const [showActiveTasks, setShowActiveTasks] = useState(false);
  const [refreshData, setRefreshData] = useState(true);
  
  const bucketHandler = ({bucketId, bucketName}: {bucketId: string; bucketName: string}) => {
    if (filterSettings)
      filterSettings.bucketId = bucketId;

    setBucketId(bucketId)    
  }

  const allTaskHandler = (allTasksFlag: boolean) => {
    if (filterSettings)
      filterSettings.showActiveTasks = allTasksFlag;

    setShowActiveTasks(allTasksFlag)    
  }

  useEffect(() => {
    if (filterSettings) {
      setBucketId(filterSettings.bucketId);
      setShowActiveTasks(filterSettings.showActiveTasks);
    }    
  }, []);

  // Get the graph client
  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsUserCredential, scope) => {
      // Set the graph client
      setGraphClient(graph);
    }, { scope: scopes } ); 

  // Create a new timeline service
  const timelineService: ITimeLineService | undefined = useMemo((): ITimeLineService | undefined => {
    if (graphClient && configSettings)
      // Create a new timeline service
      return new TimeLineService(graphClient, configSettings);
    else
      return undefined;
  }, [graphClient, configSettings]);
  
  // Set the bucket name
  const bucketName = useMemo((): string => {
    if (bucketId === 'All') {
      // Set the bucket name
      return "In all buckets";
    } else {
      // Set the bucket name
      return "Bucket: " + renderSettings?.buckets.find((bucket) => bucket.id === bucketId)?.name || "Unknown Bucket";
    }
  }, [bucketId, renderSettings?.buckets]);
  
  // Refresh the tasks
  useEffect( () => {
    const fetchData = async () => {
      if (refreshData) {
        if (timelineService && renderSettings) {
          if (retrievingTasks && filterSettings?.refreshData) {
            timeLineData.current = await timelineService.refreshTasks();
            setRefreshData(false);            
          }
          else {
            timeLineData.current = await timelineService.getTimelineData();
          }
            
          renderSettings.buckets = timelineService.getBuckets();
          renderSettings.users = timelineService.getTaskUsers();            
          renderSettings.renderYear =false;
          renderSettings.currentYear = 0;
          renderSettings.renderMonth = true;
          renderSettings.currentMonth = -1;
          renderSettings.lastRenderedDate = new Date();

          if (filterSettings) {
            setTasks(timelineService.getTasksForBucket(filterSettings));
          }
          
          setRetrievingTasks(false);
        }
      }
    };
    
    fetchData(); 
  }, [refreshData, timelineService, filterSettings, renderSettings, retrievingTasks, bucketId, showActiveTasks]);

  return (
    <div>
      { !graphClient && !loading &&
        <div>
          <p>Authorize to grant permission to access Planner Tasks.</p>
          <Button appearance="primary" disabled={loading} onClick={reload} >
            Authorize
          </Button>          
        </div>
      }
      { graphClient &&
        <>
          <div>
            { retrievingTasks &&  
              <div className={spinnerDiv}>
                <Spinner className={spinnerStyle} labelPosition="below"  label="Retrieving Tasks..."/>
              </div>
            }
            { !retrievingTasks &&      
            <>
              <div>
                <CommandBar onAllTask={allTaskHandler} onBucketId={bucketHandler} />
              </div>          
              <div className={pagePaddingStyle}>
                  { timeLineData.current?.error &&
                    <pre className={errorStyle}>Error: {timeLineData.current?.error}</pre>
                  }
                  <div>
                    <div className={planTitleStyle}>
                      <span>{showActiveTasks ? "All Planner Tasks" : "Active Planner Tasks"}</span>
                    </div>
                    {/* Bucket Name */}
                    <div className={BucketNameStyle}>
                      {bucketName}
                    </div>
                    {/* Render the timeline */}
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
              </>
            }
          </div>
        </>
      }
    </div>
  );
}
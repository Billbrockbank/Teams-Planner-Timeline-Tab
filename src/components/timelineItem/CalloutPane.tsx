import { 
  PlannerTask,
  PlannerChecklistItem,
  PlannerTaskDetails,
} from '@microsoft/microsoft-graph-types'
import { Text } from "@fluentui/react";
import { useId } from '@fluentui/react-hooks';
import moment from "moment";
import { 
  useContext,
  useState,
  useEffect
} from "react";
import { TeamsFxContext } from "../Context";
import { calloutStyles } from '../../Styles';
import { 
  ICategoryData
} from '../../models';

export default function CalloutPane( task: PlannerTask ) {
  const labelId = useId('callout-label');
  const descriptionId = useId('callout-description');
const [taskDetails, setTaskDetails] = useState<PlannerTaskDetails | undefined>(undefined);

  const { renderSettings, categorySettings, services} = useContext(TeamsFxContext);
  let completedDate: string = "";
  let bucketName: string = "N/A";
  let checklist: PlannerChecklistItem[] = [];
  
  useEffect(() => {
    if (services && !taskDetails) {
      const taskId = task.id;
      // Get Task Details
      if (taskDetails === undefined && taskId) {
        (async () => {
          if (services && services.timeLineService) {
            const details = await services.timeLineService.getTaskDetails(taskId);
            if (details) {
              setTaskDetails(details);
            }
          }
        })();
      }
    }
  }, [taskDetails, services, task.id]);

  // if the task is completed, get the completed date
  if (task.percentComplete === 100)
    if (task.completedDateTime)
      completedDate = moment(new Date(task.completedDateTime)).format("MMM D, YYYY");

  const checklistItems: Record<string, any> = taskDetails?.checklist || {};   
  if (checklistItems) {
    Object.keys(checklistItems).forEach((key: keyof typeof checklistItems) => {
      const checklistItem: PlannerChecklistItem = checklistItems[key];
      // if (!checklistItem.isChecked)
        checklist.push(checklistItem);
    });
  };

  if (task.bucketId) {
    bucketName = task.bucketId.split(':')[1];
  }

  let aUsers: string = "- ";
  // get the users assigned to the task
  if (task.assignments) {
    // loop through the assignments
    Object.keys(task.assignments).forEach((assignmentId: string) => {
      // find the user by the assignmentId
      const user = renderSettings?.users.find(
          (u) => u.id === assignmentId
      );

      // add the user's display name to the list of users
      aUsers += user?.displayName + ' - ';
    });
  }

  // get the labels
  const labels: ICategoryData[] = [];
  if (task.appliedCategories) {
    for (let i = 1; i < 26; i++) {
      const categoryKey = `category${i}` as keyof typeof task.appliedCategories;
      if (task.appliedCategories[categoryKey] === true) {
        if (categorySettings) {
          const categoryData: ICategoryData = categorySettings[categoryKey];
          labels.push(categoryData);
        }
      }
    }
  }

  return (
      <>
        <Text block variant="large" className={calloutStyles.title} id={labelId}>
          <strong>{task.title}</strong>
        </Text>
        {/* TODO: Update label from Planner settings
            TODO: fix layout and styles for labels */}
        { labels.length > 0 &&
          <div className="ms-Grid" dir="ltr">
            <div className="ms-Grid-row" style={{ paddingBottom: '10px' }}>                              
                {labels.map((label, index) => (
                  <div className="ms-Grid-col" >
                    <span key={index} style={{ padding: "1px 2px", fontSize: "10px", backgroundColor: label.backgroundColor, color: label.color, borderRadius: '5px' }}>
                      {label.text}
                    </span>
                    </div>
                ))}
            </div>
          </div>
      } 
              
        <Text block variant="small" id={descriptionId}>                
          <strong>Bucket: </strong>{bucketName}
          <br />
          { task.completedBy?.user?.displayName &&
            <>
              <strong>Created by: </strong>
              <div>
                {task.completedBy?.user.displayName}
              </div>
            </>
          }
          <span>
            {task.priority === 1 && (<><strong>Priority: </strong> Urgent<br /></>)}
            {task.priority === 3 && (<><strong>Priority: </strong> High<br /></>)}
            {task.priority === 9 && (<><strong>Priority: </strong> Low<br /></>)}            
          </span>                
          { aUsers !== "" && (
            <>
              <strong>Assigned to:</strong>
              <div>
                {aUsers}
              </div>
            </>
          )}
          { taskDetails?.description &&
              <>
                <br />
                <strong>Notes: </strong>
                <div>
                  {taskDetails?.description}
                </div>
                <br />
              </>
          }                
          { task.percentComplete === 100 &&
            <>
              <strong>Completed: </strong>
              <div>
                By: {task.completedBy?.user?.displayName} on {completedDate}
              </div>
            </>
          }
          { checklist && checklist.length > 0 &&
            <>
              <strong>Checklist:</strong>
              <ul>                      
                {checklist.map((item: PlannerChecklistItem) => (
                  <li key={item.orderHint}>
                    <div>
                      <strong>{item.isChecked && "Completed: "}</strong><span style={{ textDecoration: item.isChecked ? 'line-through' : 'none' }}>{item.title}</span>
                    </div>
                  </li>
                ))}
              </ul>  
            </>
          }
        </Text>        
      </>
    )
}
import { 
  PlannerTask,
  PlannerChecklistItem,
} from '@microsoft/microsoft-graph-types'
import { Text } from "@fluentui/react";
import { useId } from '@fluentui/react-hooks';
import moment from "moment";
import { useContext } from "react";
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { TeamsFxContext } from "../Context";
import { calloutStyles } from '../../Styles';

export default function CalloutPane(task: PlannerTask) {
  initializeIcons();
  
  const labelId = useId('callout-label');
  const descriptionId = useId('callout-description');

  const { renderSettings } = useContext(TeamsFxContext);
  let completedDate: string = "";
  let bucketName: string = "N/A";
  let checklist: PlannerChecklistItem[] = [];
  
  // if the task is completed, get the completed date
  if (task.percentComplete === 100)
    if (task.completedDateTime)
      completedDate = moment(new Date(task.completedDateTime)).format("MMM D, YYYY");

  const checklistItems: Record<string, any> = task.details?.checklist || {};   
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
   
  let aUsers: string = "";
  // get the users assigned to the task
  if (task.assignments) {
    // loop through the assignments
    Object.keys(task.assignments).forEach((assignmentId: string) => {
      // find the user by the assignmentId
      const user = renderSettings?.users.find(
          (u) => u.id === assignmentId
      );

      // add the user's display name to the list of users
      aUsers += user?.displayName + ' ';
    });
  }
  
  return (
      <>
        <Text block variant="large" className={calloutStyles.title} id={labelId}>
          <strong>{task.title}</strong>
        </Text>
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
          { task.details?.description &&
              <>
                <br />
                <strong>Notes: </strong>
                <div>
                  {task.details?.description}
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
                  <li>
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
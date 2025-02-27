import { 
  PlannerTask,
  PlannerChecklistItem,
  PlannerTaskDetails,
} from '@microsoft/microsoft-graph-types'
import { 
  CheckmarkCircleFilled as CompletedIcon,
 } from "@fluentui/react-icons";
import { useId } from '@fluentui/react-hooks';
import moment from "moment";
import { 
  useContext,
  useState,
  useEffect
} from "react";
import { TeamsFxContext } from "../Context";
import { CalloutStyles } from '../../Styles';
import PriorityIcon from './PriorityIcon';
import { 
  ICategoryData
} from '../../models';

export default function CalloutPane( task: PlannerTask ) {
  const labelId = useId('callout-label');
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

  let aUsers: string = "";
  // get the users assigned to the task
  if (task.assignments) {
    aUsers = "- ";
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
        <div dir="ltr" id={labelId} className={CalloutStyles.calloutTitleStyles}>
          <strong>{task.title}</strong>
        </div>
        { labels.length > 0 &&
          <div dir="ltr">
            <div className={CalloutStyles.labelsBlockStyle}>
              {labels.map((label, index) => (
                <div key={index} className={CalloutStyles.labelItemStyle}>
                  <div className={CalloutStyles.labelItemColorStyle(label)}>
                    {label.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        }        
        <div className={CalloutStyles.bucketLabelStyle}>
          Bucket: {bucketName}
        </div>          
        { task.completedBy?.user?.displayName &&
          <div>
            <div className={CalloutStyles.sectionTitleStyle}>
              Created by: 
            </div>
            <div className={CalloutStyles.priorityStatusStyle}>
              {task.completedBy?.user.displayName}
            </div>            
          </div>
        }
        <PriorityIcon priority={task.priority ?? 0} forTimeline={false} />
        <div>
          <div className={CalloutStyles.sectionTitleStyle}>
            Progress: 
          </div>
          <div className={CalloutStyles.priorityStatusStyle}>
            {task.percentComplete === 100 ? "Completed" : task.percentComplete === 50 ? "In Progress" : "Not Started"}
          </div>          
        </div>
        { task.dueDateTime && (
          <div>
            <div className={CalloutStyles.sectionTitleStyle}>
              Due:
            </div>
            <div>
              {moment(new Date(task.dueDateTime)).format("MMM D, YYYY")}
            </div>
          </div>  
        )}
        { aUsers.replace('- ', '') !== "" && (
          <div>
            <div className={CalloutStyles.sectionHeadingStyle}>
              Assigned to:
            </div>
            <div>
              { aUsers === "- " ? "" : aUsers }
            </div>
          </div>
        )}
        { taskDetails?.description &&
          <>
            <div className={CalloutStyles.sectionHeadingStyle}>
              Notes:
            </div>
            <div className={CalloutStyles.calloutNotesStyle}>
                {taskDetails?.description}
            </div>                
          </>
        }                
        { task.percentComplete === 100 &&
          <>
            <div className={CalloutStyles.sectionHeadingStyle}>
              Completed:
            </div>
            <div>
              By: {task.completedBy?.user?.displayName} on {completedDate}
            </div>
          </>
        }
        { checklist && checklist.length > 0 &&
          <>
            <div className={CalloutStyles.checklistHeadingStyle}>
              Checklist:
            </div>
            <ul className={CalloutStyles.checklistListStyle}>
              {checklist.map((item: PlannerChecklistItem) => (
                <li key={item.orderHint}>
                  <div className={CalloutStyles.CheckListLineItemStyle} >
                    {item.isChecked && 
                      <div className={CalloutStyles.completeLabelStyle} >
                        <CompletedIcon className={CalloutStyles.CompletedIconStyle}/>
                      </div>}
                    <div className={item.isChecked ? CalloutStyles.competedItemStyle : CalloutStyles.checklistItemStyle}>
                      {item.title}
                    </div>
                  </div>
                </li>
              ))}
            </ul>  
          </>
        }             
      </>
    )
}
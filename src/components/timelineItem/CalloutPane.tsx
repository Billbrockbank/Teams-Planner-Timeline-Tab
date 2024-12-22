import { 
  PlannerTask,
  PlannerChecklistItem,
  PlannerTaskDetails,
} from '@microsoft/microsoft-graph-types'
import { 
  ArrowDown16Filled as LowIcon,
  Important16Filled as ImportantIcon,
  AlertUrgent16Filled as UrgentIcon,
  Circle16Filled as MediumIcon,
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
import { 
  calloutTitleStyles,
  labelsBlockStyle,
  labelItemStyle,
  bucketLabelStyle,
  sectionTitleStyle,
  priorityStatusStyle,
  sectionHeadingStyle,
  calloutNotesStyle,
  checklistHeadingStyle,
  checklistListStyle,
  checklistItemStyle,
  completeLabelStyle,
  competedItemStyle,
  urgentIconStyle,
  lowIconStyle,
  importantIconStyle,
  CompletedIconStyle,
  CheckListLineItemStyle,
} from '../../Styles';
import { mergeStyles } from "@fluentui/react";

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

  // function to style the label
  function labelItemColorStyle(label: ICategoryData): string {
    const className = mergeStyles({
      padding: "1px 5px",
      fontSize: "10px",
      backgroundColor: label.backgroundColor,
      color: label.color,
      borderRadius: '5px'
    });

    return className;
  }
  
  return (
      <>
        <div dir="ltr" id={labelId} className={calloutTitleStyles}>
          <strong>{task.title}</strong>
        </div>
        { labels.length > 0 &&
          <div dir="ltr">
            <div className={labelsBlockStyle}>
              {labels.map((label, index) => (
                <div key={index} className={labelItemStyle}>
                  <div className={labelItemColorStyle(label)}>
                    {label.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        }        
        <div className={bucketLabelStyle}>
          Bucket: {bucketName}
        </div>          
        { task.completedBy?.user?.displayName &&
          <div>
            <div className={sectionTitleStyle}>
              Created by: 
            </div>
            <div className={priorityStatusStyle}>
              {task.completedBy?.user.displayName}
            </div>            
          </div>
        }      
        {task.priority === 1 && (
          <div>
            <div className={sectionTitleStyle}>Priority: </div>
            <div className={priorityStatusStyle }>
              <UrgentIcon className={urgentIconStyle}/>
              Urgent
            </div>
          </div>)}
        {task.priority === 3 && (
          <div>
            <div className={sectionTitleStyle}>Priority: </div>
            <div className={priorityStatusStyle}>
              <ImportantIcon className={importantIconStyle}/>
              High
            </div>
          </div>)}
        {task.priority === 9 && (
          <div>
            <div className={sectionTitleStyle}>Priority: </div>
            <div className={priorityStatusStyle}>
              <LowIcon className={lowIconStyle}/>
              Low
            </div>
          </div>)}        
        { aUsers.replace('- ', '') !== "" && (
          <div>
            <div className={sectionHeadingStyle}>
              Assigned to:
            </div>
            <div>
              { aUsers === "- " ? "" : aUsers }
            </div>
          </div>
        )}
        { taskDetails?.description &&
          <>
            <div className={sectionHeadingStyle}>
              Notes:
            </div>
            <div className={calloutNotesStyle}>
                {taskDetails?.description}
            </div>                
          </>
        }                
        { task.percentComplete === 100 &&
          <>
            <div className={sectionHeadingStyle}>
              Completed:
            </div>
            <div>
              By: {task.completedBy?.user?.displayName} on {completedDate}
            </div>
          </>
        }
        { checklist && checklist.length > 0 &&
          <>
            <div className={checklistHeadingStyle}>
              Checklist:
            </div>
            <ul className={checklistListStyle}>
              {checklist.map((item: PlannerChecklistItem) => (
                <li key={item.orderHint}>
                  <div className={CheckListLineItemStyle} >
                    {item.isChecked && 
                      <div className={completeLabelStyle} >
                        <CompletedIcon className={CompletedIconStyle}/>
                      </div>}
                    <div className={item.isChecked ? competedItemStyle : checklistItemStyle}>
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
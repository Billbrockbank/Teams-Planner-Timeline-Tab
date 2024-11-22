import { 
  PlannerTask,
  PlannerChecklistItem,
} from '@microsoft/microsoft-graph-types'
import { 
  mergeStyles,
  mergeStyleSets,  
  FontWeights,
  Callout,
  DirectionalHint,
  Text,
  IIconProps,
  HighContrastSelector,  
 } from "@fluentui/react";
 import { 
  useBoolean, 
  useId 
} from '@fluentui/react-hooks';
import { 
  IButtonStyles, 
  IconButton, 
} from '@fluentui/react/lib/Button';
import moment from "moment";
import { 
  useContext,
  useState
 } from "react";
 import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { TeamsFxContext } from "../Context";
import { 
  timelineItemStyle,
  timelineContentStyle,
  timelineMarkerStyle,
  isCompletedStyle,
  isOverDueStyle,
  isPrimaryStyle,
  isOutlinedStyle,
  completedTaskStyle,
  overDueTaskStyle,
  inprogressTaskStyle,
  notstartedTaskStyle,
  taskItemTitleStyle,
  calloutStyles,
} from '../../Styles';

export default function TimelineDetails(task: PlannerTask) {
  const aline: string = "right";
  
  initializeIcons();
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
  
  const infoIcon: IIconProps = { iconName: 'InfoSolid' }; //'Info' };

  const buttonId = useId('callout-button');
  const labelId = useId('callout-label');
  const descriptionId = useId('callout-description');

  const { renderSettings } = useContext(TeamsFxContext);
  let startDate: string = "";  
  let dueDate: string = "";
  let isOverDue: boolean = false;
  let completedDate: string = "";
  let bucketName: string = "N/A";
  let checklist: PlannerChecklistItem[] = [];
  
  if (task.startDateTime)
    startDate = "Start: " + moment(new Date(task.startDateTime)).format("MMM D, YYYY");
  else 
    startDate = "Start anytime";

  if (task.dueDateTime) {
    dueDate = "Due: " + moment(new Date(task.dueDateTime)).format("MMM D, YYYY");
    isOverDue = moment(new Date(task.dueDateTime)).isBefore(new Date()); 
  }
  
  if (task.percentComplete === 100)
    if (task.completedDateTime)
      completedDate = moment(new Date(task.completedDateTime)).format("MMM D, YYYY");

  const timelineMarkerClass = [mergeStyles(timelineMarkerStyle)];
  const gridClass = ['ms-Grid'];

  const checklistItems: Record<string, any> = task.details?.checklist || {};   
  if (checklistItems) {
    Object.keys(checklistItems).forEach((key: keyof typeof checklistItems) => {
      const checklistItem: PlannerChecklistItem = checklistItems[key];
      if (!checklistItem.isChecked)
        checklist.push(checklistItem);
    });
 };

  if (task.percentComplete === 100) {
    timelineMarkerClass.push(isCompletedStyle);
    gridClass.push(completedTaskStyle);
  } else if (isOverDue) {
    timelineMarkerClass.push(isOverDueStyle);
    gridClass.push(overDueTaskStyle);
  } else if (task.percentComplete === 50) {
    timelineMarkerClass.push(isPrimaryStyle);
    gridClass.push(inprogressTaskStyle);
  } else {
    timelineMarkerClass.push(isOutlinedStyle);
    gridClass.push(notstartedTaskStyle);
  }

  if (task.bucketId) {
    bucketName = task.bucketId.split(':')[1];
  }
   
  let aUsers: string = "";
  if (task.assignments) {
    Object.keys(task.assignments).forEach((assignmentId: string) => {
      // find the user by the assignmentId
      const user = renderSettings?.users.find(
          (u) => u.id === assignmentId
      );

      aUsers += user?.displayName + ' ';
    });
  }
  
  return (
      <>
        <div className={timelineItemStyle}>
          <div className={timelineMarkerClass.join(' ')}></div>
          <div className={timelineContentStyle}>
            <div className={gridClass.join(' ')} dir={aline === 'right' ? 'ltr' : 'rtl'}>
              <div className="ms-Grid-row">
                  <div className="ms-Grid-col">
                    <span>{dueDate}</span>
                  </div>
                  <div className="ms-Grid-col">
                    <span>{startDate}</span>                    
                  </div>
              </div> 
              <div className="ms-Grid-row">
                <div className="ms-Grid-col">
                  <span>
                    <IconButton
                      id={buttonId}
                      iconProps={infoIcon}                      
                      onClick={toggleIsCalloutVisible}                      
                      disabled={false}
                      checked={false} />
                  </span>
                  <span className={taskItemTitleStyle}>
                    {task.title}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {isCalloutVisible ? (
            <Callout
              ariaLabelledBy={labelId}
              ariaDescribedBy={descriptionId}
              role="dialog"
              className={calloutStyles.callout}
              gapSpace={0}
              target={`#${buttonId}`}
              isBeakVisible={true}
              beakWidth={20}
              onDismiss={toggleIsCalloutVisible}
              directionalHint={DirectionalHint.bottomLeftEdge}
              setInitialFocus>

              <Text block variant="large" className={calloutStyles.title} id={labelId}>
                <strong>{task.title}</strong>
              </Text>
              <Text block variant="small" id={descriptionId}>                
                <strong>Task Bucket: </strong>{bucketName}
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
                  {task.priority === 1 && (<><strong>Priority: </strong> Urgent</>)}
                  {task.priority === 3 && (<><strong>Priority: </strong> High</>)}
                  {task.priority === 9 && (<><strong>Priority: </strong> Low</>)}                
                  <br />
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
                      <strong>Task Description: </strong>
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
                            {item.title}                            
                          </div>
                        </li>
                      ))}
                    </ul>  
                  </>
                }
              </Text>
            </Callout>) : null }          
        </div>
      </>
    )
}
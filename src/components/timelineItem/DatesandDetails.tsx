import { PlannerTask } from '@microsoft/microsoft-graph-types'
import { 
  mergeStyles,
  Callout,
  DirectionalHint  
 } from "@fluentui/react";
 import { 
  useBoolean, 
  useId 
} from '@fluentui/react-hooks';
import moment from "moment";
import { Info24Filled as InfoIcon } from "@fluentui/react-icons";
import CalloutPane from './CalloutPane'; // Adjust the import path as necessary
import { 
  timelineItemStyle,
  timelineContentStyle,
  timelineMarkerStyle,  
  isCompletedStyle,
  darkIsCompletedStyle,
  isOverDueStyle,
  darkIsOverDueStyle,
  isPrimaryStyle,
  darkIsPrimaryStyle,  
  completedTaskStyle,
  darkCompletedTaskStyle,
  overDueTaskStyle,
  darkOverDueTaskStyle,
  inprogressTaskStyle,
  darkInprogressTaskStyle,
  isOutlinedStyle,
  notStartedTaskStyle,
  taskItemTitleStyle,  
  calloutStyles,
} from '../../Styles';

import { useContext } from 'react';
import { TeamsFxContext } from '../Context';

export default function TimelineDetails(task: PlannerTask) {
  const { themeString } = useContext(TeamsFxContext);

  const aline: string = "right";
  
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
  
  const buttonId = useId('callout-button');
  const labelId = useId('callout-label');
  const descriptionId = useId('callout-description');

  let startDate: string = "";  
  let dueDate: string = "";
  let isOverDue: boolean = false;
  
  // if the task has a start date, get the start date
  if (task.startDateTime)
    startDate = "Start: " + moment(new Date(task.startDateTime)).format("MMM D, YYYY");
  else 
    startDate = "Start anytime";

  // if the task has a due date, get the due date
  if (task.dueDateTime) {
    dueDate = "Due: " + moment(new Date(task.dueDateTime)).format("MMM D, YYYY");
    // check if the task is overdue by comparing the due date + 1 day to today's date
    isOverDue = moment(new Date(task.dueDateTime)).add(1, 'd').isBefore(new Date()); 
  }
  
  const timelineMarkerClass = [mergeStyles(timelineMarkerStyle)];
  const gridClass = ['ms-Grid'];

  if (task.percentComplete === 100) {
    if (themeString === "dark") {
      timelineMarkerClass.push(darkIsCompletedStyle);
      gridClass.push(darkCompletedTaskStyle);
    } else {
      timelineMarkerClass.push(isCompletedStyle);
      gridClass.push(completedTaskStyle);
    }
  } else if (isOverDue) {
    if (themeString === "dark") {
      timelineMarkerClass.push(darkIsOverDueStyle);
      gridClass.push(darkOverDueTaskStyle);
    } else {
      timelineMarkerClass.push(isOverDueStyle);
      gridClass.push(overDueTaskStyle);
    }
  } else if (task.percentComplete === 50) {
    if (themeString === "dark") {
      timelineMarkerClass.push(darkIsPrimaryStyle);
      gridClass.push(darkInprogressTaskStyle);
    } else {
      timelineMarkerClass.push(isPrimaryStyle);
      gridClass.push(inprogressTaskStyle);
    }
  } else {    
    timelineMarkerClass.push(isOutlinedStyle);
    gridClass.push(notStartedTaskStyle);
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
                    <InfoIcon
                      style={{ marginTop: '5px', marginRight: '5px', paddingBottom: '5px', cursor: 'pointer' }}
                      id={buttonId}
                      onClick={toggleIsCalloutVisible}/>                    
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

              <CalloutPane {...task} />
            </Callout>) : null }          
        </div>
      </>
    )
}
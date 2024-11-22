import { PlannerTask } from '@microsoft/microsoft-graph-types'
import { 
  TimelineYear,
  TimelineMonth,
  TimelineDetails
} from '..';
import { mergeStyles } from "@fluentui/react";
 
import { 
  timelineItemStyle,
  timelineContentStyle,
  timelineMarkerStyle,
  isCompletedStyle,
  isOverDueStyle,
  isPrimaryStyle,
  isOutlinedStyle
} from '../../Styles';

export default function TimelineItem(task: PlannerTask) {  
  let isOverDue: boolean = false;
  
  const timelineMarkerClass = [mergeStyles(timelineMarkerStyle)];

  if (task.percentComplete === 100) {
    timelineMarkerClass.push(isCompletedStyle);
  } else if (isOverDue) {
    timelineMarkerClass.push(isOverDueStyle);
  } else if (task.percentComplete === 50) {
    timelineMarkerClass.push(isPrimaryStyle);
  } else {
    timelineMarkerClass.push(isOutlinedStyle);
  }
  
  return (
      <>
        <TimelineYear {...task} />
        <div>
          <div className={timelineItemStyle}>
            <div className={timelineContentStyle}></div>
          </div>
          <TimelineMonth {...task} />
        </div>
        <TimelineDetails {...task} />        
      </>
    )
}

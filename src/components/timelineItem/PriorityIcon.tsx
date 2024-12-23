import { 
  ArrowDown16Filled as LowIcon,
  Important16Filled as ImportantIcon,
  AlertUrgent16Filled as UrgentIcon,
  // Circle16Filled as MediumIcon,
  CheckmarkCircleFilled as CompletedIcon,
  } from "@fluentui/react-icons";
  import {
  sectionTitleStyle,
  priorityStatusStyle,
  urgentIconStyle,
  lowIconStyle,
  importantIconStyle,
} from '../../Styles';

export default function PriorityIcon(props: { priority: number } ) {
    
  return (
    <>
      {props.priority === 1 && (
        <div>
          <div className={sectionTitleStyle}>Priority: </div>
          <div className={priorityStatusStyle }>
            <UrgentIcon className={urgentIconStyle}/>
            Urgent
          </div>
        </div>)}
      {props.priority === 3 && (
        <div>
          <div className={sectionTitleStyle}>Priority: </div>
          <div className={priorityStatusStyle}>
            <ImportantIcon className={importantIconStyle}/>
            High
          </div>
        </div>)}
      {props.priority === 9 && (
        <div>
          <div className={sectionTitleStyle}>Priority: </div>
          <div className={priorityStatusStyle}>
            <LowIcon className={lowIconStyle}/>
            Low
          </div>
        </div>)}        
    </>
  )
}

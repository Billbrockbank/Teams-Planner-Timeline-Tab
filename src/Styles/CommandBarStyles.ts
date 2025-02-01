import {
  mergeStyles,
  IStackStyles,
} from "@fluentui/react";

export class CommandBarStyles {
  public static stackStyles: IStackStyles = {
    root: {
      paddingTop: 5,    
      height: 40,
      width: '100%',
    },
  };

  public static BucketLabelStyle = mergeStyles({
    paddingRight: '5px', 
    verticalAlign: "middle" 
  });

  public static barDivStyle = mergeStyles({
    display: 'flex',
    alignItems: 'center'
  });

  public static activeTasksCheckboxStyle = mergeStyles({
    paddingLeft: '3px',  
    verticalAlign: "middle"  
  });

  public static refreshButtonStyle = mergeStyles({
    width: '30px', 
    height: '30px', 
    marginLeft: '5px'
  });

  public static bucketDropdownStyle = mergeStyles({
    dropdown: {
      paddingleft: 5,
      width: 250,
      verticalAlign: "middle",
    },
  });
}

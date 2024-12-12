import {
  getTheme,
  DefaultPalette,
  mergeStyles,
  mergeStyleSets,
  FontWeights,
  ICheckboxStyles,
  IDropdownStyles,
  IStackStyles,  
} from "@fluentui/react";
import { makeStyles } from "@fluentui/react-components";


const useStyles = makeStyles({
  wrapper: {
    columnGap: "15px",
    display: "flex",
    minWidth: "min-content",
  },
});

export class TabStyles {
  static activeTaskscheckbox: ICheckboxStyles = {
    root: {
      paddingTop: 5,
      paddingLeft: 10,
      paddingRight: 10,
      background: DefaultPalette.neutralLighterAlt,
    },
  };
}

export const BucketNameStyle = mergeStyles({
  paddingBottom: '10px', 
  fontSize: '20px' 
});

export const BucketDDLabelStyle = mergeStyles({
  paddingRight: '5px', 
  verticalAlign: "middle" 
});

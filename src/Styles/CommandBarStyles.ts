import {
  mergeStyles,
  IStackStyles,
  DefaultPalette,
  getTheme,
  IDropdownStyles,
  ICheckboxStyles, 
} from "@fluentui/react";

const palette = getTheme().palette;

export const stackStyles: IStackStyles = {
  root: {
    paddingTop: 10,    
    height: 50,    
    background: DefaultPalette.whiteTranslucent40,
  },
};

export const BucketLabelStyle = mergeStyles({
  paddingRight: '5px', 
  verticalAlign: "middle" 
});


export const barDivStyle = mergeStyles({
  display: 'flex',
  alignItems: 'center'
});

export const activeTasksCheckboxStyle = mergeStyles({
  paddingTop: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  background: 'rgb(245, 245, 245)'
});

// export const activeTasksCheckboxStyle: ICheckboxStyles = {
//   root: {
//     paddingTop: 5,
//     paddingLeft: 10,
//     paddingRight: 10,
//     background: DefaultPalette.neutralLighterAlt,
//   },
// };

export const refreshButtonStyle = mergeStyles({
  width: '30px', 
  height: '30px', 
  marginLeft: '5px'
});

export const bucketDropdownStyle = mergeStyles({
  width: '200px'
});

export const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: {
    width: 250,
    verticalAlign: "middle",
  },
};

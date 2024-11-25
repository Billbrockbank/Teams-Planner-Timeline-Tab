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

const palette = getTheme().palette;

export const timelineStyle = mergeStyles({
  display: "flex",
  WebkitBoxOrient: "vertical",
  WebkitBoxDirection: "normal",
  msFlexDirection: "column",
  flexDirection: "column"
});

export const timelineItemStyle = mergeStyles({
  display: "flex",
  position: "relative",
  marginLeft: "2em",
  paddingBottom: ".5em",
  selectors: {
    "::before": {
      content: '""',
      backgroundColor: "#b5b5b5",
      display: "block",
      width: ".1em",
      height: "100%",
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0
    }
  }
});

export const timelineContentStyle = mergeStyles({
  padding: "1em 0 0 2em"
});

export const timelineHeaderStyle = mergeStyles({
  width: "4em",
  minWidth: "4em",
  maxWidth: "8em",
  wordWrap: "normal",
  textAlign: "center",
  display: "flex",
  WebkitBoxPack: "center",
  justifyContent: "center",  
});

export const pagepaddingStyle = mergeStyles({
  paddingTop: "2rem",
  paddingBottom: "2rem",
  paddingLeft: "2rem",
  paddingRight: "2rem"
});

export const planTitleStyle = mergeStyles({
  fontSize: "1.5rem",
  fontWeight: 600,
  marginBottom: "0.5rem",
  paddingBottom: "1rem",
});

export const ActionButtonStyle = mergeStyles({
  margin: "0.5rem",
  width: "10rem"  
});

export const errorStyle = mergeStyles({
  color: DefaultPalette.redDark,
  fontWeight: "bold"
});

export const spinnerStyle = mergeStyles({
  paddingTop: "2rem",
  color: "#5b5fc7",
  Label: { 
    color: "#5b5fc7"
  }  
});

export const tabStyle = mergeStyles({
  WebkitBoxAlign: "center",
  msFlexAlign: "center",
  alignItems: "center",        
  borderRadius: "3px",
  display: "inline-flex",
  height: "2em",
  WebkitBoxPack: "center",
  msFlexPack: "center",
  justifyContent: "center",
  lineHeight: 1.5,
  paddingLeft: ".75em",
  paddingRight: ".75em",
  whiteSpace: "nowrap",
});

export const isPrimaryStyle = mergeStyles({
  backgroundColor: palette.themePrimary,
  border: `1px solid ${palette.themePrimary}`,
  color: palette.themeLighterAlt,
});

export const isOutlinedStyle = mergeStyles({
  backgroundColor: "#fff !important",
  border: "1px solid #0078d4"
});

export const isMediumStyle = mergeStyles({
  fontSize: "1rem"
});

export const timelineMonthStyle = mergeStyles(
  tabStyle,
  isPrimaryStyle
);

export const timelineYearStyle = mergeStyles(
  tabStyle, 
  isMediumStyle,
  isPrimaryStyle,
);

export const overDueTaskStyle = mergeStyles({
  color: palette.red,
  fontWeight: "400",
});

export const completedTaskStyle = mergeStyles({
  color: palette.green,
  fontWeight: 500,
});

export const inprogressTaskStyle = mergeStyles({
  color: palette.blue,
  fontWeight: 500,
});

export const notstartedTaskStyle = mergeStyles({
  color: palette.black,
  fontWeight: 500,
});

export const timelineMarkerStyle = mergeStyles({
  position: "absolute",
  background: "#b5b5b5",
  border: "0.1em solid #b5b5b5",
  borderRadius: "100%",
  content: '""',
  display: "block",
  height: "1em",
  left: "-0.5em",
  top: "1.2rem",
  width: "1em",
});


export const isCompletedStyle = mergeStyles({
  backgroundColor: palette.greenDark,
  color: palette.white,
  border: `1px solid ${palette.greenDark}`,
});

export const isOverDueStyle = mergeStyles({
  backgroundColor: palette.red,
  color: palette.white,
  border: `1px solid ${palette.red}`,
});

export const taskItemTitleStyle = mergeStyles({
  display: "inline-block",
  verticalAlign: "top",
  paddingTop: 4,
  width: 240,
  height: 30,
  whiteSpace: "nowrap",
});

export const calloutStyles = mergeStyleSets({
  callout: {
    width: 320,
    padding: "20px 24px",
  },
  title: {
    marginBottom: 12,
    fontWeight: FontWeights.semilight,
  },
});

export const activeTaskscheckbox: ICheckboxStyles = {
  root: {
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    background: DefaultPalette.neutralLighterAlt,
  },
};

export const refreshTaskscheckbox: ICheckboxStyles = {
  root: {
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    background: DefaultPalette.neutralLighterAlt,
  },
};

export const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: {
    width: 250,
    verticalAlign: "middle",
  },
};

export const stackStyles: IStackStyles = {
  root: {
    paddingTop: 10,
    height: 30,
    background: DefaultPalette.neutralLighterAlt,
  },
};
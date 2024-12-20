import {
  getTheme,
  mergeStyles,
  mergeStyleSets,
  FontWeights,
} from "@fluentui/react";

const palette = getTheme().palette;

export const timelineContentStyle = mergeStyles({
  padding: "1em 0 0 2em"
});

export const isCompletedStyle = mergeStyles({
  backgroundColor: palette.green,
  color: palette.white,
  border: `1px solid ${palette.green}`,
});

export const darkIsCompletedStyle = mergeStyles({
  backgroundColor: palette.greenLight,
  color: palette.greenLight,
  border: `1px solid ${palette.greenLight}`,
});

export const isOverDueStyle = mergeStyles({
  backgroundColor: palette.red,
  color: palette.red,
  border: `1px solid ${palette.red}`,
});

export const darkIsOverDueStyle = mergeStyles({
  backgroundColor: palette.orangeLighter,
  color: palette.orangeLighter,
  border: `1px solid ${palette.orangeLighter}`,
});


export const isPrimaryStyle = mergeStyles({
  backgroundColor: palette.blue,
  border: `1px solid ${palette.blue}`,
  color: palette.blue,
});

export const darkIsPrimaryStyle = mergeStyles({
  backgroundColor: palette.blueLight,
  border: `1px solid ${palette.blueLight}`,
  color: palette.blueLight,
});


export const isOutlinedStyle = mergeStyles({
  backgroundColor: "#fff !important",
  border: "0.1em solid #b5b5b5"  
});

export const completedTaskStyle = mergeStyles({
  color: palette.green,
  fontWeight: 400,
});

export const darkCompletedTaskStyle = mergeStyles({
  color: palette.greenLight,
  fontWeight: 400,
});

export const overDueTaskStyle = mergeStyles({
  color: palette.red,
  fontWeight: 400,
});

export const darkOverDueTaskStyle = mergeStyles({
  color: palette.orangeLighter, 
  fontWeight: 400,
});


export const inprogressTaskStyle = mergeStyles({
  color: palette.blue,
  fontWeight: 400,
});

export const darkInprogressTaskStyle = mergeStyles({
  color: palette.blueLight,
  fontWeight: 400,
});


export const notStartedTaskStyle = mergeStyles({
  fontWeight: 400,
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

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
  backgroundColor: palette.greenDark,
  color: palette.white,
  border: `1px solid ${palette.greenDark}`,
});

export const isOverDueStyle = mergeStyles({
  backgroundColor: palette.red,
  color: palette.white,
  border: `1px solid ${palette.red}`,
});

export const isPrimaryStyle = mergeStyles({
  backgroundColor: palette.blue,
  border: `1px solid ${palette.blue}`,
  color: palette.blue,
});

export const isOutlinedStyle = mergeStyles({
  backgroundColor: "#fff !important",
  border: "0.1em solid #b5b5b5"  
});

export const completedTaskStyle = mergeStyles({
  color: palette.green,
  fontWeight: 400,
});

export const overDueTaskStyle = mergeStyles({
  color: palette.red,
  fontWeight: 400,
});

export const inprogressTaskStyle = mergeStyles({
  color: palette.blue,
  fontWeight: 400,
});

export const notstartedTaskStyle = mergeStyles({
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

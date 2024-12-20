import {
  getTheme,
  mergeStyles,
  mergeStyleSets,
  FontWeights,
} from "@fluentui/react";

const palette = getTheme().palette;

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

export const labelsBlockStyle = mergeStyles({
  paddingBottom: '10px',
  marginLeft: '0px'                             
});

export const labelItemStyle = mergeStyles({
  display: 'inline-block', 
  paddingRight: '3px', 
  marginBottom: '5px'
});
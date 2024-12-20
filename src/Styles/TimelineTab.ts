import {
  getTheme,
  DefaultPalette,
  mergeStyles,
} from "@fluentui/react";

const palette = getTheme().palette;

export const pagePaddingStyle = mergeStyles({
  paddingTop: "0.5rem",
  paddingBottom: "2rem",
  paddingLeft: "2rem",
  paddingRight: "2rem"
});

export const listedTaskStyle = mergeStyles({
  paddingBottom: '10px', 
  marginLeft: "-0.5rem",
  fontSize: '20px' 
});

export const BucketNameStyle = mergeStyles({
  fontSize: "1.5rem",
  fontWeight: 600,  
  marginLeft: "-1rem",
  paddingBottom: "1rem",
});

export const errorStyle = mergeStyles({
  color: DefaultPalette.redDark,
  fontWeight: "bold"
});

export const spinnerDiv = mergeStyles({
  maxWidth: "500px",  
});

export const spinnerStyle = mergeStyles({
  paddingLeft: "10rem",
  paddingTop: "2rem",
  color: "#5b5fc7",  
  Label: { 
    color: "#5b5fc7"
  }  
});
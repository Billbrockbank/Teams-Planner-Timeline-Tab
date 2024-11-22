import { TeamsUserCredential } from "@microsoft/teamsfx";
import { createContext } from "react";
import { Theme } from "@fluentui/react-components";
import { IRenderSettings } from "../models";

export const TeamsFxContext = createContext<{
  theme?: Theme;
  themeString: string;
  teamsUserCredential?: TeamsUserCredential; 
  renderSettings?: IRenderSettings  
}>({
  theme: undefined,
  themeString: "",
  teamsUserCredential: undefined,
  renderSettings: {
    renderYear: true,
    currentYear: 0,
    renderMonth: true,
    currentMonth: -1,
    hideCompletedTasks: false,
    showBuckets: [],
    lastRenderedDate: new Date(),
    orderBy: "dueDateTime",
    buckets: [],
    users: []
  }
});

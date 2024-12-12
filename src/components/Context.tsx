import { TeamsUserCredential } from "@microsoft/teamsfx";
import { createContext } from "react";
import { Theme } from "@fluentui/react-components";
import { 
  IRenderSettings,
  IConfigSettings,
  IFilterSettings,
} from "../models";
import { IFilterService } from "../services";

export const TeamsFxContext = createContext<{
  theme?: Theme;
  themeString: string;
  teamsUserCredential?: TeamsUserCredential; 
  configSettings: IConfigSettings;
  renderSettings?: IRenderSettings;
  filterSettings?: IFilterSettings;
  filterService?: IFilterService;
}>({
  theme: undefined,
  themeString: "",
  teamsUserCredential: undefined,
  configSettings: {
    groupId: "",
    pageId: ""
  },
  filterSettings: {
    bucketId: "All",
    showActiveTasks: true,
    refreshData: false,
  },
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

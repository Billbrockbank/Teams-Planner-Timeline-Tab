// https://fluentsite.z22.web.core.windows.net/quick-start
import {
  FluentProvider,
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  Spinner
} from "@fluentui/react-components";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { 
  useTeams,
  useTeamsUserCredential 
} from "@microsoft/teamsfx-react";
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import { TeamsFxContext } from "./Context";
import config from "../config";
import {
  TimelineConfig,
  TimelineTab,
} from '.';
import {
  IRenderSettings,
  IConfigSettings,  
  IFilterSettings,
  IServices,
  AppliedCategoryColors,
} from "../models";
import { FilterService } from "../services";
import { 
  useMemo
} from "react";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  const [{ context }] = useTeams();

  const groupId = useMemo(() => {
    return context?.team?.groupId;
  }, [context]);

  const planId = useMemo(() => {
    const planSettings = context?.page?.id ? JSON.parse(context.page.id) : '';
    return planSettings?.planId ?? ''
  }, [context]);
  
  const pageId = useMemo(() => {
    const planSettings = context?.page?.id ? JSON.parse(context.page.id) : '';
    return planSettings?.uniqueId ?? '';
  } , [context]);

  const filterService = useMemo<FilterService>(() => {
    return new FilterService({
      bucketId: "All",
      showActiveTasks: true,
      refreshData: false,
    });
  }, []);

  const { loading, theme, themeString, teamsUserCredential } = useTeamsUserCredential({
    initiateLoginEndpoint: config.initiateLoginEndpoint!,
    clientId: config.clientId!,
  });

  const configSettings: IConfigSettings = {
    groupId: groupId ?? '',
    pageId: pageId,
    planId: planId,
  }

  const services: IServices = {
    timeLineService: undefined,
  }

  const filterSettings = useMemo<IFilterSettings>(() => {  
    if (!pageId || !filterService) {
      return {
        bucketId: "All",
        showActiveTasks: true,
        refreshData: false,
      }
    } else {
      return filterService.getFilterSettings(pageId);    
    }
  }, [pageId, filterService]);

  const renderSettings: IRenderSettings = {
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
  
  return (
    <TeamsFxContext.Provider value={{ theme, themeString, teamsUserCredential, configSettings, filterSettings, filterService, renderSettings, categorySettings: AppliedCategoryColors, services }}>
      <FluentProvider
        theme={
          themeString === "dark"
            ? teamsDarkTheme
            : themeString === "contrast"
            ? teamsHighContrastTheme
            : {
                ...teamsLightTheme,
                colorNeutralBackground3: "#eeeeee",
              }
        }
        // style={{ background: tokens.colorNeutralBackground3 }}
      >
        <Router>
          {loading ? (
            <Spinner style={{ margin: 100 }} />
          ) : (
            <Routes>
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/termsofuse" element={<TermsOfUse />} />
              <Route path="/Timeline-config" element={<TimelineConfig />} />
              <Route path="/TimelineTab" element={<TimelineTab />} />
              <Route path="*" element={<TimelineTab />} />
            </Routes>
          )}
        </Router>
      </FluentProvider>
    </TeamsFxContext.Provider>
  );
}
// Remove the incorrect useRef function implementation


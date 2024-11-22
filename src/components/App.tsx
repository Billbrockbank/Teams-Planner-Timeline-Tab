// https://fluentsite.z22.web.core.windows.net/quick-start
import {
  FluentProvider,
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  Spinner
} from "@fluentui/react-components";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { useTeamsUserCredential } from "@microsoft/teamsfx-react";
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import { TeamsFxContext } from "./Context";
import config from "./sample/lib/config";
import {
  TimelineConfig,
  TimelineTab,
} from '.';
import { IRenderSettings } from "../models";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  const { loading, theme, themeString, teamsUserCredential } = useTeamsUserCredential({
    initiateLoginEndpoint: config.initiateLoginEndpoint!,
    clientId: config.clientId!,
  });

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
    <TeamsFxContext.Provider value={{ theme, themeString, teamsUserCredential, renderSettings }}>
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

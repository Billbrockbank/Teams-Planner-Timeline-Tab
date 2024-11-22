import {
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

import { initializeIcons } from '@fluentui/font-icons-mdl2';

import * as microsoftTeams from "@microsoft/teams-js";
import { useTeams } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "../Context";

export default function Config() {
  const [isChecked, setIsChecked] = useState(false);
  // const [groupId, setgroupId] = useState("All");

  const { themeString } = useContext(TeamsFxContext);
  const [{ context }] = useTeams();
  const entityId = useRef("");
  initializeIcons();
  
  const onSaveHandler = (saveEvent: microsoftTeams.pages.config.SaveEvent) => {
    const baseUrl = `https://${window.location.hostname}:${window.location.port}/index.html#`;
    
    microsoftTeams.pages.config.setConfig({
      suggestedDisplayName: 'Planner Tasks Timeline',
      entityId: entityId.current,
      contentUrl: `${baseUrl}/TimelineTab`
    }).then(() => {      
      saveEvent.notifySuccess();
    });
  };

  useEffect(() => {
    if (context) {
      (async () => {
        const currentConfig = await microsoftTeams.pages.getConfig();
        setIsChecked(currentConfig?.entityId === "FilterActiveTasks");
        microsoftTeams.pages.config.registerOnSaveHandler(onSaveHandler);
        microsoftTeams.pages.config.setValidityState(true);        
      })();
    }
  }, [context]);

  return (
    <>
      <div className={themeString === "default" ? "light" : themeString === "dark" ? "dark" : "contrast"}>
      </div>      
    </>
  );

}

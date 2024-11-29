import {
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import{ v4 as uuidv4 } from 'uuid';
import { initializeIcons } from '@fluentui/font-icons-mdl2';

import * as microsoftTeams from "@microsoft/teams-js";
import { useTeams } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "../Context";

export default function Config() {
  const { themeString } = useContext(TeamsFxContext);
  const [{ context }] = useTeams();
  
  initializeIcons();
  
  const uniqueId = generateShortUniqueId();
  const entityId = useRef(uniqueId);

  const onSaveHandler = (saveEvent: microsoftTeams.pages.config.SaveEvent) => {
    const baseUrl = `https://${window.location.hostname}:${window.location.port}/index.html#`;

    microsoftTeams.pages.config.setConfig({
      suggestedDisplayName: 'Planner Tasks Timeline',
      entityId: entityId.current,
      contentUrl: `${baseUrl}/TimelineTab`,
    }).then(() => {      
      saveEvent.notifySuccess();
    });
  };

  useEffect(() => {
    if (context) {
      (async () => {
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

function generateShortUniqueId() {
    // Generate a full UUID
    const fullUuid = uuidv4();
    // Take the first 14 characters of the UUID
    return fullUuid.replace(/-/g, '').substring(0, 14);
}

import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  Button, 
  Spinner,  
} from '@fluentui/react-components';
import{ v4 as uuidv4 } from 'uuid';
import * as microsoftTeams from "@microsoft/teams-js";
import { useTeams } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "../Context";
import { Client } from "@microsoft/microsoft-graph-client";
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { PlannerPlan } from '@microsoft/microsoft-graph-types'
import {
  Tooltip,
  Dropdown,
  Option,
  useId,
} from '@fluentui/react-components';

export default function Config() {
  const { themeString, configSettings, teamsUserCredential } = useContext(TeamsFxContext);
  const [{ context }] = useTeams();

  const scopes = ['User.Read.All', 'Tasks.Read', 'GroupMember.Read.All', 'Tasks.ReadWrite', 'TeamSettings.Read.All'];

  const dropdownId = useId('dropdown');
  const [needConsent, setNeedConsent] = useState(false);
  const [graphClient, setGraphClient] = useState<Client>();
  const [planId, setPlanId] = useState<string>("");
  const [plans, setPlans] = useState<PlannerPlan[]>([]);
  const planName = useRef<string>("");
  
  // Get the graph client
  const { loading, reload } = useGraphWithCredential(
    async (graph, teamsUserCredential, scope) => {      
      if (needConsent) {
        await teamsUserCredential.login(scopes);

        setNeedConsent(false);
      }
      try {
        // Get token to confirm the user is logged in
        await teamsUserCredential.getToken(scopes);
        
        setNeedConsent(false);        
      } catch (error: any) {        
        if (error.message.includes('Failed to get access token cache silently, please login first')) {
          // set needConsent to true
          setNeedConsent(true);
        }
      }

      // Set the graph client
      setGraphClient(graph);
    }, { scope: scopes, credential: teamsUserCredential }); 
  
  const uniqueId = generateShortUniqueId();
  const entityId = useRef(uniqueId);

  const onSaveHandler = (saveEvent: microsoftTeams.pages.config.SaveEvent) => {
    const baseUrl = `https://${window.location.hostname}:${window.location.port}/index.html#`;

    microsoftTeams.pages.config.setConfig({
      suggestedDisplayName: `${planName.current} Timeline`,
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
        microsoftTeams.pages.config.setValidityState(false);
      })();
    }
  }, [context]);

  useEffect(() => {
    if (planId) {
      entityId.current = JSON.stringify({ planId: planId, uniqueId: uniqueId });
    }
  }, [planId]);

  const dropDownOptions = useMemo(() => {
    const options: JSX.Element[] = [];

    // options.push(<Option key="new" value="new" text="Create New Plan">Create New Plan</Option>);
    
    plans.forEach((plan: PlannerPlan) => {
      return options.push(<Option key={plan.id} value={plan.id} text={plan.title ?? 'Unnamed Plan'}>{plan.title}</Option>);
    });

    return options;
  }, [plans]);

  const PlanSelect = useCallback((event: any, data: any) => {
      if (data) {
        // Set the bucket id from selection
        const planId = data.optionValue || "new"
          
        // Set the bucket name from selection
        const name = data.optionText || "";
        planName.current = name;      
        
        microsoftTeams.pages.config.setValidityState(true);
        setPlanId(planId);
      }
    }, []);

  useEffect(() => {
    if (graphClient && configSettings) {
      graphClient.api(`/groups/${configSettings.groupId}/planner/plans`)
        .get()
        .then((response) => {
          setPlans(response.value);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [graphClient, configSettings]);

  return (
    <>
      { needConsent ?
        <div>
          <p>Authorize to grant permission to access Planner Tasks.</p>
          <Button appearance="primary" disabled={loading} onClick={reload} >
            Authorize
          </Button>          
        </div>
      :      
        <div className={themeString === "default" ? "light" : themeString === "dark" ? "dark" : "contrast"}>
          <div className="config-container">
            <div className="config-header">
              <h1>Select Plan for Timeline</h1>
            </div>
            <div className="config-body">
              <div className="config-body-content">
                <Tooltip content="Plan for Timeline to Render" relationship="label">
                  <Dropdown placeholder='Select a Plan' 
                            aria-labelledby={dropdownId}                                                        
                            onOptionSelect={PlanSelect} >                
                    { dropDownOptions }              
                  </Dropdown>
                </Tooltip>                
              </div>
            </div>
          </div>        
        </div>      
      }
    </>
  );
}

function generateShortUniqueId() {
    // Generate a full UUID
    const fullUuid = uuidv4();
    // Take the first 14 characters of the UUID
    return fullUuid.replace(/-/g, '').substring(0, 14);
}

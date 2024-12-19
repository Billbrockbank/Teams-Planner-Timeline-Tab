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
                <Tooltip content="Plan for Timeline to Render3:45. I just get ready. I. I. I. San Bernardino CA. 2.7 hash shoots. Cancel at CBC Singapore made the first two years case in March 11 chest this is saying how the case depression was used as your heart. Relations. Hip. Objects to passes past the submission. Society vicious. I. She says. She says she's. Not true. She's like a person that I have a good place. I. This holiday season. And. He actually was feeling better. OK, and he was actively. I. Now. I. So it looks like one of the impression that you have lost circles. Mary probably has probably has something. Positive and negative and that would, I think that would have been back on the relationship with her daughter. She was really trying to get each. And now threatening to destroy. Relationships. In our relationship, because it already struck me kind of hard so that we can. Have a garden. She's and she's a wizard. She said it wasn't home. I haven't started. She didn't cry at all. She was friends. Yes. Then she. I. I. I watch everyone say I'll have a voice express, have a work in the air. So the second thing is. How to best support the person? So let me ask you about how. Weren't able to get in because of some insight. I was saying that is. This. Is life or not situation? This is joking us. And I see that you're going to record those things so they can feel free and I think when they feel worthy that you're confident for them, so. I think the Germany is a very critical junction right now. They matter for parts and I think it's important is under control. They could continue to go that way. So today she's called a professional people. That's ordered. I didn't have to prepare problems anything and it's important that I'm really positive and I just hope that I have. Nice to meet you. This. Is Michael. She wants to. Go and. Recipe. So Allen is praying gentleman for Sally. She's like she. 's She's very sorry. She wants to tell her. You want to smell like everything on. Maybe I have a point, because I'm right. Being too constructive, this is racist. Thank you. Serious side effects and raise information at all by the problems while you prescribe these. I. This is. Once filled, this three bedrooms with a loan has been clear. It's wild and so. This is this is just a huge step. And see things. My life probably discuss some people and other people will say well, she wish I had that. Just a few miles down the road for his house. Two months ago. This is where the fire started on the show. I needed to use this appointment. Wanted to test the song, but you get the plug in stuff on the store. Pushed it out of the way doing that. 30 seconds later. Wait, wait. Yeah, it was. Horrible, just canceling the meeting. It was cold here when I come to have an hour close the window and I put on the propane heat. Stay out all the time. But the horror came prepared there from fire. He needs to clear out literally decades worth himself. They might be sleeping. On this shoe and how much food can one person? There's enough food in there and family of 10 for six months. Guidelines. But he's unlabeled. But he can tell by the star maybe what it is once directly, and this is a dollar by itself, a bit of a mystery time. From Thailand. Are you joking? I will take it to mine and. Story of static blake and Salad were used as II, am AA kind of. Continues to spend his time and. The staff can't understand, can't say any word, can't watch TV. Kitchen table you could eat. It. All of this harmony is structural and sound. The fire department will not turn against where electricity back on. To the ground because his father built that house from. Ilovemonday.com What's.com? Alright, so getting started with using samples. We're gonna talk today about how to start using the PNPSPFX web parts extension and other samples when we launched Sharing is Caring initiative to assist with contributing to the PNP Github repositories. We also started getting some feedback that there's not only new developers to the community that want to contribute, but there's also new developers to the community. That want to consume GitHub is still new to them so. It's had it been three years? Underneath this couch, she catches. She couch under here. There are three bedrooms in my own two baths. It's full of stuff there to see. Hey, Cortana. Bicycles. After an investigation. Several violations warning should be a serious. Animal organization. We'll come here. They show my electricity off 30 days. During that time, my client backed up. The water heater exploded. Out it wasn't, so it's been taken up. Don't open this for anything. Out there. I. Smallest. 20 to 60% off other retailers braces at the top wearing lost yes for less. Explore the fight, the fighting wind, and the quiet concert of elegant simulations of No children Have Never casinos. We actually have reinvented ocean villages, designing all inclusive experiences for the thinking person. Like, well, steps by both traveling Asia and combine that. Biking. So we don't put this. In the other question if you have a question. Since they've seen their childhood, grandchildren have never inside. Hey, all right. Stop right there. Make that shine. Hey, Cortana. Hey, Cortana, close. That's right. That host at all as a child. Ren upstairs outside. She kept outside. 10 years old. My parents had been up, so I took it with my mom once I find out. Then my room became storage. What do you think? This is her OK. I was upset, obviously, because I tried, but it's not such means that we care anymore. It's it's yeah, I'm censored. Yes. It doesn't get that balance because I had this. Shopaholic. Bring it at home. Then you better put it someplace, but you got Shelby and warehousing. It just gets stuck on top of other stuff. I can't understand. I just. Saw the last way I ever want to be. 2000 miles south in the Los Angeles cycles. Then I spent the past five years playing. I think you had a social interaction. To visit the first time. She had the greatest house warping party. A lot of her family members were there and we were so proud of her being homeless and they quite actually White House. That's just somewhere. The house was nice and decorated and there wasn't any clutter. It was just. Also, we can't be here. Nothing else to be here. I know that's right. I don't want to have to. And she does need help. She could. I'm serious. I want again. House was not safe house. Presiding passions are. And then careful. You have an accumulation of things. Rescue. And. Possibility. As yet, I can be homeless. Found the issue. Family issue issues. How many years so? I mean, personally, me, I don't like. Washington's face. All I want to do is get ready to keep that is able to do it. The actual box, you can't hear the wife, she said. This ticket's going to be a pleasure in this way. So that's why I'm here. Wasted what I had daily OK. The main thing is that. Or single. Order books. Urge to love you so much. I did find a little frustrating that she wanted you, I don't know, discuss things that doesn't dishonest. Nobody's really willing to address the paper issues here and. They trust you, bring a lot of of attention, so we'll see what happens. In the eye a psychologist who specialized in their right now is she's a absolute surprise. She has been supporting. I think she's a previously unaware of it but it has evolved to our Commission and now the question is she. Learning how to stress that children think about their research. So. So what we want you to do is. Myself. To help. Tolerate that distress. She learns that she doesn't have to be pushed around. 1 Jerry. OK cross. You got two minutes left. Make a mutual customized by car insurance. I'd say nothing if you wanted to say speaker myself. All four verses until they find embracing those members of mine. She shoots three scores in mind. There's no kidding like that. You can't deny that slice back. This is the magic happened. Celebrate with Ferraris, smooth chocolate and crushed hazelnut. At the moment it's a rare mission. It's the holidays and wait for yo, it's a kiss clock, you gotta stop your kids. But it's camera so unique. So one thing that we did not cover that I wanted to. They're always on this step and those. Place down there. Yes. It's important to help you train yourself when she fails to stress, not to reflect that, not to sit there and to learn that it will pass should be OK. Yes, I have your Jesus. It's just a beautiful picture. It's very hard for me. I can probably have. At least 25 years from my leg. To do what I need to do right now. What's going on? I. If you want some help, we're here to help you. I. But in order to be able to access the fridge and access these very large items in one hour, we have. To make a decision. Let me work. We have a plan. Go to the plan. We only going to say hey. Yes. Are you cheating everything so? Hey, Cortana. 3 BHK Apartments flats for sale in. Lakshadweep. Local lights and cultural treasures. Because what? You're serious? You're on a bias. You'll spend less time and more time exploring the world. The handsome special students keep where you just where you just have to step into your own. Grandparents. I. At Tsc.Ca are one gift from Tom Brand Villas or Everything Holidays. Courtesy is all here at GST shopping Study offers every day at Tsc.Ca. Entire house for $19. Hey Cortana dishes. By watching my windows you just make a date, take it cleaner and the children spot this house for $19. I love using and I think you will do. That. Cinderella, 17, will never work for us. Help bring it back into control. I hope that in 6 weeks. The impact? And I was like very bad drive, so I want to keep this. Account. Some nice. I. The process of one issue. Amazon. Electronic. And that's people, that's not rehab target circle pieces. I'm gonna love this. Morning. I just settle this special with a couple of days, a little deadline. It's not. The smallest. Before. I. At work, at school, and everywhere else, it all depends on your. In this one year I had over $900 in banking fees, and I had enough. And I realized just how much money I can see. That's what I found time and I signed up. There's no overtraction. Someone over £60 50 free Atms just by making with trying to have saved hundreds of dollars a year. And he isn't that extra money for my dollars feature myself with small rings. joinme@chime.com. TV. Change the past six weeks, he and his daughter have been working. On my God, she she she was a girlfriend. OK. Sorry. Don't go do much shopping. Please find down the production. Makes a lot better than us. So much for saying it was my own. Pretty much disappear. She's well on his way, thank you very much. So I don't see why. You've done it. The last time he's down with China for Better 0. Last time I wished this place was small. There's. It's a possibility that there's so much storage at all for her to lift the tag. Hi, thank you for stopping by. Very, very good. Why do not say so? Oh hi, my shirt. I've never thought of it before. Very nice. I noticed that it's been easier and easier to replace. The mattress. She just didn't see anything. But the shiny partisan progress can't make of any reason why. You go to text you. I didn't expect that. I didn't respect that at all. And I was straight according to thank you. Very thank you. For relationships and they're very happy there's a motion joined it. Now listen, I used to be home. Like a monster. .com Sign up today and you could have Disney vacations and Big money. First offset this $1000. The category's characters do we do? Elsa and yes, that's right. Eastchester NY. Actually our translation because these things and indications with her, I was looking to indications and she's been very excellent and it makes a lot of sense to her destination meeting. And you know Disney World Christmas. My favorite is 74. Christmas watch. 30 to 50 people that morning and it's just all before children and my nine grandchildren. At last Christmas morning we were able to receive your pride and sheep for a Christmas party. I. $2000 the category. And. " relationship="label">
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

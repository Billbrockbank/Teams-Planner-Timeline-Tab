# M365 Planner Timeline view Teams App

## Table of Contents

- [Summary](#summary)
- [Tools and Frameworks](#tools-and-frameworks)
- [Prerequisites](#prerequisites)
- [Version history](#version-history)
- [Features](#features)
- [Minimal path to awesome](#minimal-path-to-awesome---debug-against-a-real-microsoft-365-tenant)
- [Help](#help)
- [References](#references)
- [Disclaimer](#disclaimer)

## Summary

![License.](https://img.shields.io/badge/license-MIT-green.svg)

_The purpose of this sample Teams Toolkit Tab is to remder the tasks in the buckets of a M365 Group's Planner. It also implements single sign-on authentication._

**TODO: ADD MORE HERE!**

<p>
    <img src="images/Planner-Timeline-tab.gif" width=700>    
</p>

## Tools and Frameworks

![drop](https://img.shields.io/badge/Teams&nbsp;Toolkit&nbsp;for&nbsp;VS&nbsp;Code-5.10.1-blue.svg)


_Teams Toolkit pulls in some standard libraries and SDK's to Create React App. Since these are aligned with Teams Toolkit versions._

## Prerequisites
> - A [Microsoft 365 account for development](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts)
> - Admins Access to a Office 365 tenant
> - [Node.js](https://nodejs.org/), supported versions: 18, 20
> - Set up and install Teams Toolkit for Visual Studio Code v5.0 [How to install Teams Toolkit v5.0](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/install-teams-toolkit?tabs=vscode).
> - [Set up your dev environment for extending Teams apps across Microsoft 365](https://aka.ms/teamsfx-m365-apps-prerequisites)
>   Please note that after you enrolled your developer tenant in Office 365 Target Release, it may take couple days for the enrollment to take effect.
> - [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version 5.0.0 and higher or [Teams Toolkit CLI](https://aka.ms/teamsfx-toolkit-cli)

1. First, select the Teams Toolkit icon on the left in the VS Code toolbar.
2. In the Account section, sign in with your [Microsoft 365 account](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts) if you haven't already.
3. Press F5 to start debugging which launches your app in Teams using a web browser. Select `Debug in Teams (Edge)` or `Debug in Teams (Chrome)`.
4. When Teams launches in the browser, select the Add button in the dialog to install your app to Teams.

_Please list any portions of the toolchain required to build and use the sample, along with download links_

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|January 15, 2025|Bill Brockbank|Initial release

## Features

- React with Fluent Web application.
- Access the Planner task via Microsoft Graph in the Web app (not through a Azure function)
- Filter task by active or all tasks including completed.
- Tasks rendering colors:

    Color | Status | Criteria 
    ----------|------------|--------------------------------
    **Red** | Overdue | Passed Due Date
    **Green** | Complete | Progress set to "Completed"
    **Blue** | In progress| Progress set to "In Progress"
    **Black** | Not Due | Progress set to "Not Started"

- Filter by Task bucket in Planner.
- Refresh Planner Tasks then re-rending with the selected filter settings.
- Caching Planner Task and filter settings in the browswer session Storage.
- Callout on tasks for more details. **Insert IMAGE HERE**
---

**TO DO:** Add Steps to deploy Dev buld to Azure with Temas CLI
---

## Minimal path to awesome - Debug against a real Microsoft 365 tenant

- Clone repo
- Open repo in VSCode
- Press <kbd>F5</kbd>, follow the sign in prompts
- When prompted, click on the link in the console to perform the tenant-wide admin consent
- Wait for deploy and provision tasks to complete.
- The first time you run the code you will need to "Authorize permission to access Planner Tasks" 

    <p>
        <img src="images/Authorize.gif" width=550>
    </p>

    | Graph API Permissions |
    | --------------------- |
    | User.Read.All         |
    | Tasks.Read            |
    | TeamSettings.Read.All |      

    <p>
        <img src="images/Accept-Permissions.gif" width=300>
    </p>    
    

- The Planner Tasks reneder will by from the same Team tou add the App into.

## Help

We do not support samples, but this community is always willing to help, and we want to improve these samples. We use GitHub to track issues, which makes it easy for  community members to volunteer their time and help resolve issues.

You can try looking at [issues related to this sample](https://github.com/pnp/teams-dev-samples/issues?q=sort%3Aupdated-desc+is%3Aissue+is%3Aopen) to see if anybody else is having the same issues.

If you encounter any issues using this sample, [create a new issue](https://github.com/pnp/teams-dev-samples/issues/new).

Finally, if you have an idea for improvement, [make a suggestion](https://github.com/pnp/teams-dev-samples/issues/new).

---

## References

- [Teams Toolkit Documentations](https://docs.microsoft.com/microsoftteams/platform/toolkit/teams-toolkit-fundamentals)
- [Teams Toolkit CLI](https://aka.ms/teamsfx-toolkit-cli)
- [Microsoft Teams SDK](https://learn.microsoft.com/en-us/javascript/api/overview/msteams-client?view=msteams-client-js-latest&tabs=npm)
- Host your app in Azure by [provision cloud resources](https://learn.microsoft.com/microsoftteams/platform/toolkit/provision) and [deploy the code to cloud](https://learn.microsoft.com/microsoftteams/platform/toolkit/deploy)
- [Teams Toolkit Samples](https://github.com/OfficeDev/TeamsFx-Samples)

---

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**


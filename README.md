# M365 Planner Timeline view

## Summary

_The purpose of this sample Teams Toolkit Tab is to remder the tasks in the buckets of a M365 Group's Planner. It also implements single sign-on authentication._

**TODO: ADD MORE HERE!**

**Nead Screen Image**

![picture of the app in action](#)

## Tools and Frameworks

![drop](https://img.shields.io/badge/Teams&nbsp;Toolkit&nbsp;for&nbsp;VS&nbsp;Code-5.10.1-blue.svg)

_Teams Toolkit pulls in some standard libraries and SDK's such as the Bot Framework SDK and Create React App. Since these are aligned with Teams Toolkit versions, there is no reason to include them here unless you changed them._

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
1.0|January 5, 2025|Bill Brockbank|Initial release

## Features

- Using FluentUI 9 compontents
- Generating Entra ID access tokens for Microsoft Graph to access the Groups Planner Tasks

_Below there is a clear image used for telemetry. Please change "readme-template" to your sample name._

<img src="https://m365-visitor-stats.azurewebsites.net/sp-dev-fx-webparts/samples/readme-template" />

---

## Minimal path to awesome - Debug against a real Microsoft 365 tenant

- Clone repo
- Open repo in VSCode
- Press <kbd>F5</kbd>, follow the sign in prompts
- When prompted, click on the link in the console to perform the tenant-wide admin consent
- Wait for all tasks to complete

**Add additional steps HERE**

      | Graph API Permissions |
      | --------------------- |
      | User.Read.All         |
      | Tasks.Read            |
      | TeamSettings.Read.All |      

## Help

We do not support samples, but this community is always willing to help, and we want to improve these samples. We use GitHub to track issues, which makes it easy for  community members to volunteer their time and help resolve issues.

You can try looking at [issues related to this sample](https://github.com/pnp/graph-connectors-samples/issues?q=label%3A%22sample%3A%nodejs-typescript-policies%22) to see if anybody else is having the same issues. <= TO DO: Fix Link

If you encounter any issues using this sample, [create a new issue](https://github.com/pnp/graph-connectors-samples/issues/new). <= TO DO: Fix Link

Finally, if you have an idea for improvement, [make a suggestion](https://github.com/pnp/graph-connectors-samples/issues/new). <= TO DO: Fix Link

---

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## References

- [Teams Toolkit Documentations](https://docs.microsoft.com/microsoftteams/platform/toolkit/teams-toolkit-fundamentals)
- [Teams Toolkit CLI](https://aka.ms/teamsfx-toolkit-cli)
- [Microsoft Teams SDK](https://learn.microsoft.com/en-us/javascript/api/overview/msteams-client?view=msteams-client-js-latest&tabs=npm)
- Host your app in Azure by [provision cloud resources](https://learn.microsoft.com/microsoftteams/platform/toolkit/provision) and [deploy the code to cloud](https://learn.microsoft.com/microsoftteams/platform/toolkit/deploy)
- [Teams Toolkit Samples](https://github.com/OfficeDev/TeamsFx-Samples)

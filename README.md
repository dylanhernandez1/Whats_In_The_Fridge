# WHATS IN THE FRIDGE?

## Instructions:

1. Run `npm install` and `npm install react-router-dom` from the root for application to run


## Figma/Prototype Information

**Figma Link:** https://www.figma.com/design/2t0g61ZrfOgUqMNpqOzQGS/whats-in-my-fridge?node-id=3-4&t=2IYp4LDfXmCGodHy-1

**Figma Prototype Link:** https://www.figma.com/proto/2t0g61ZrfOgUqMNpqOzQGS/whats-in-my-fridge?node-id=3-4&t=2IYp4LDfXmCGodHy-1

Note: Need to include auto formatting based on dimensinons on screen.


## Format Rules:

**Link:** https://airbnb.io/javascript/react/

Installing Prettier:
1. Go to extensions on the left hand bar on VS Code
2. Search `Prettier` and Install


## Merging, Pulling, Committing, and Pushing

1. Create a branch `git branch TESTBRANCH`
2. Update main before branching `git pull origin main`
3. Go into the branch `git checkout TESTBRANCH`
4. Retrieve latest from main `git pull origin TESTBRANCH` OR `git fetch`
5. Modify code and files
6. After finishing run `npm run format` AND `npm run lint`
7. Commit your branch `git commit -m "Message"`
8. Push your branch `git push`
9. Route back to main `git checkout main`
10. Retrieve latest from main again (in case you don't have the lastest version) `git pull origin main` 
11. If there is modifications, fix and then merge `git merge TESTBRANCH`
12. Push all changes to repo `git push origin main`

Sometimes your branch will pull from your branch in the repo. To update your branch after someone else, you have to checkout into your branch and `git merge origin` to have everything updated in your branch.


## SPRINT 1 HELPER

1. Toolbar.jsx is where you create the buttons.
2. Create your page via Terminal `touch FORMNAME.jsx` and then modify it, you can use Profile.jsx as reference
3. MyApp.jsx is where you modify what paths redirect to what, import your file at the top of MyApp.jsx. For example, `import Home from "./Home"` `import Profile from "./Profile"`
4. In the app of MyApp.jsx
`<Route path="/PATH" element={ <NAME OF FILE parameters to send to file/> } />`


# WHATS IN THE FRIDGE?

## Instructions:

1. Run `npm install` and `npm install react-router-dom` from the root for application to run

## Merging, Pulling, Committing, and Pushing

1. Create a branch `git branch TESTBRANCH`
2. Go into the branch `git checkout TESTBRANCH`
3. Retrieve latest from main `git pull origin TESTBRANCH` OR `git fetch`
4. Modify code and files
5. After finishing run `npm run format` AND `npm run lint`
6. Commit your branch `git commit -m "Message"`
7. Push your branch `git push`
8. Route back to main `git checkout main`
9. Retrieve latest from main again (in case you don't have the lastest version) `git pull origin main` 
10. If there is modifications, fix and then merge `git merge TESTBRANCH`
11. Push all changes to repo `git push origin main`

## Figma/Prototype Information

**Figma Link:** https://www.figma.com/design/2t0g61ZrfOgUqMNpqOzQGS/whats-in-my-fridge?node-id=3-4&t=2IYp4LDfXmCGodHy-1

**Figma Prototype Link:** https://www.figma.com/proto/2t0g61ZrfOgUqMNpqOzQGS/whats-in-my-fridge?node-id=3-4&t=2IYp4LDfXmCGodHy-1

Note: Need to include auto formatting based on dimensinons on screen.

## Format Rules:

**Link:** https://airbnb.io/javascript/react/


## SPRINT WEEK 1 HELPER

1. Toolbar.jsx is where you create the buttons.
2. MyApp.jsx is where you modify what paths redirect to what, import your file at the top of MyApp.jsx. For example, `import Home from "./Home"` `import Profile from "./Profile"`
3. In the app of MyApp.jsx
`<Route
   path="/PATH"
   element={
   <NAME OF FILE
   parameters to send to file
   />
   }
  />`


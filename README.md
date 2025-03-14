# WHATS IN THE FRIDGE?

## Instructions:

1. Run `npm install` and `npm install react-router-dom` and `npm install react-icons` and `npm install dotenv` from the root for application to run
2. Run `npm install --save-dev jest` and `npm install @testing-library/react @testing-library/user-event react-router-dom jest` and `npm install jest-environment-jsdom --save-dev` and `npm install util --save-dev` and `npm install --save-dev babel-jest @babel/core @babel/preset-env @babel/preset-react` and `npm install --save-dev @testing-library/react @testing-library/jest-dom` and `npm install --save-dev identity-obj-proxy` and `npm install mongodb-memory-server` from root for tests to run
3. Coverage npm test -- --coverage
4. To run the backend, create a .env file `touch .env` and copy and paste this in `MONGODB_URI = "mongodb+srv://whats-in-the-fridge-user:DWIRaCXhO11dWbPY@cluster0.dmiyl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"`.
   DWIRaCXhO11dWbPY is our temporary testing database password.

## Figma/Prototype Information

**Figma Link:** https://www.figma.com/design/2t0g61ZrfOgUqMNpqOzQGS/whats-in-my-fridge?node-id=3-4&t=2IYp4LDfXmCGodHy-1

**Figma Prototype Link:** https://www.figma.com/proto/2t0g61ZrfOgUqMNpqOzQGS/whats-in-my-fridge?node-id=3-4&t=2IYp4LDfXmCGodHy-1

Note: Need to include auto formatting based on dimensinons on screen.

## Product Tech Spec

**Link:** https://docs.google.com/document/d/1Ak_zM_7FnW5PO-jdHTA8a4cIh58q4heEO3FUmQtbRik/edit?usp=sharing

## UML

**UML Class Diagram:** https://drive.google.com/file/d/1S4yT_NFGVBmOmzIkn5r9AaRlGA2nTrHd/view?usp=sharing

## Product Presentation

**Link:** https://docs.google.com/presentation/d/1mYY5xVuRVQNVl82VJjr9D-LUXhEZOkWFhZJvqiZmHfY/edit?usp=sharing

## Format Rules:

**Link:** https://airbnb.io/javascript/react/

Installing Prettier:

1. Go to extensions on the left hand bar on VS Code
2. Search `Prettier` and Install

## Merging, Pulling, Committing, and Pushing

1. Create a branch `git branch TESTBRANCH`
2. Update main before branching `git pull origin main`
3. Go into the branch `git checkout TESTBRANCH`
4. Retrieve latest from main `git pull origin main` OR `git merge origin` OR `git fetch`
5. Modify code and files
6. After finishing run `npm run format` AND `npm run lint`
7. Add the files `git add .` or `git add --all`
8. Commit your branch `git commit -m "Message"`
9. Push your branch `git push`
10. Route back to main `git checkout main`
11. Retrieve latest from main again (in case you don't have the lastest version) `git pull origin main`
12. If there is modifications, fix and then merge `git merge TESTBRANCH`
13. Push all changes to repo `git push origin main`

## SPRINT 1 HELPER

1. Toolbar.jsx is where you create the buttons.
2. Create your page via Terminal `touch FORMNAME.jsx` and then modify it, you can use Profile.jsx as reference
3. Routes.jsx is where you modify what paths redirect to what, import your file at the top of Routes.jsx. For example, `import Home from "./Home"` `import Profile from "./Profile"`
4. In Routes.jsx, if your path requires props, you must manually add the prop in MyApp.jsx in the `const allProps` section
5. Use path `"/"` as a template if you are passing props

## SPRINT 2 HELPER

1. If your container is overlapping with the toolbar, the toolbar is 80px wide so have margin-left: 80px;

## SPRINT 3 HELPER

1. For adding food
   `function addFood() {
  const promise = fetch("http://localhost:8000/food", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: text
      amount, type, expiration, etc...
    })
  });
  return promise;
}`

## React icons

**Link:** https://react-icons.github.io/react-icons/

## Test Coverage

------------------|---------|----------|---------|---------|-------------------
File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------------|---------|----------|---------|---------|-------------------
All files         |   98.33 |    95.45 |     100 |     100 |                   
 food-item.js     |     100 |      100 |     100 |     100 |                   
 food-services.js |     100 |      100 |     100 |     100 |                   
 user-services.js |     100 |      100 |     100 |     100 |                   
 user.js          |      75 |       50 |     100 |     100 | 15                
------------------|---------|----------|---------|---------|-------------------

Test Suites: 2 passed, 2 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        4.46 s, estimated 5 s
Ran all test suites.

# WHATS IN THE FRIDGE?

## Instructions:

1. Run `npm install` and `npm install react-router-dom` and `npm install react-icons` and `npm install dotenv` from the root for application to run
2. Run `npm install --save-dev jest` and `npm install @testing-library/react @testing-library/user-event react-router-dom jest` and `npm install jest-environment-jsdom --save-dev` and `npm install util --save-dev` and `npm install --save-dev babel-jest @babel/core @babel/preset-env @babel/preset-react` and `npm install --save-dev @testing-library/react @testing-library/jest-dom` and `npm install --save-dev identity-obj-proxy` and `npm install mongodb-memory-server` and `npm install mockingoose` from root for tests to run
3. Coverage npm test -- --coverage
4. To run the backend, create a .env file `touch .env` and copy and paste this in `MONGODB_URI = "mongodb+srv://whats-in-the-fridge-user:DWIRaCXhO11dWbPY@cluster0.dmiyl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"`.
   DWIRaCXhO11dWbPY is our temporary testing database password.

## Current Demo

**Link:** https://drive.google.com/file/d/1-DF9gWVICOnoTd2iIAfFA8pn8QXNmS5H/view?usp=sharing

## Final Presentation

**Link:** https://docs.google.com/presentation/d/1mYY5xVuRVQNVl82VJjr9D-LUXhEZOkWFhZJvqiZmHfY/edit?usp=sharing

## Figma/Prototype Information

**Figma Link:** https://www.figma.com/design/2t0g61ZrfOgUqMNpqOzQGS/whats-in-my-fridge?node-id=3-4&t=2IYp4LDfXmCGodHy-1

**Figma Prototype Link:** https://www.figma.com/proto/2t0g61ZrfOgUqMNpqOzQGS/whats-in-my-fridge?node-id=3-4&t=2IYp4LDfXmCGodHy-1

Note: Need to include auto formatting based on dimensinons on screen.

## Product Tech Spec

**Link:** https://docs.google.com/document/d/1Ak_zM_7FnW5PO-jdHTA8a4cIh58q4heEO3FUmQtbRik/edit?usp=sharing

## UML

**UML Class Diagram:** https://drive.google.com/file/d/1S4yT_NFGVBmOmzIkn5r9AaRlGA2nTrHd/view?usp=sharing

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

## React icons

**Link:** https://react-icons.github.io/react-icons/

## Test Coverage

3/14/2025 11:00AM:

| File               | % Stmts   | % Branch   | % Funcs   | % Lines   | Uncovered Line #s   |
| ------------------ | --------- | ---------- | --------- | --------- | ------------------- |
| All files          | 100       | 100        | 100       | 100       |
| food-item.js       | 100       | 100        | 100       | 100       |
| food-services.js   | 100       | 100        | 100       | 100       |
| user-services.js   | 100       | 100        | 100       | 100       |
| user.js            | 100       | 100        | 100       | 100       |
| ------------------ | --------- | ---------- | --------- | --------- | ------------------- |

Test Suites: 2 passed, 2 total
Tests: 20 passed, 20 total
Snapshots: 0 total
Time: 8.146 s
Ran all test suites.

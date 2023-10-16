# IRD AUTO-UI

### REQUIREMENTS:
- Node.js 16+ (as of 16/10/2023)


### PROJECT SETUP:
1. When opening for the first time, accept 'recommended extensions' popup.
2. Run: `npm install`
3. Run: `npx playwright install chromium firefox webkit`
4. Choose the title of a test and run: `npx playwright test -g "test title name here"`


### BASIC COMMANDS:
- Run all spec files in parallel, in headless mode: `npx playwright test`
- Run a specific test file: `npx playwright test tests/outright.spec.ts`
- Run a specific test by specifying the line the test method is on: `npx playwright test tests/outright.spec.ts:94`


### FLAGS:
- Show browser when running test: `--headed`
- Create a trace for failed tests: `--trace on`
- Run in debug mode: `--debug`
- Run in UI mode: `--ui`

more commands and flags here... https://playwright.dev/docs/test-cli


### CODE SNIPPETS:      
- New describe block: `pw-describe`
- New test method: `pw-test`
- Many others available just type `pw-` in a test method to see them.


### FRAMEWORK:
- We do not use Page Objects or the POM, we have User Objects instead. Buyside, Sellside, and Base.
- Tests are run using 1 bs and 1 ss org, so there's one set of ref data for bs and one for ss. 
- Each test suite (spec file) has it's own bs and ss desk and user, permissioned only with each other.
- Tests within a spec file run sequentially. Spec files run in parallel with each other.
- All integrations (e.g. Markitwire, Triana, ANNADSB) are turned off, we only want to test our own code.
However we could mock data if turning integrations off becomes a blocker. If we wanted to test our integrations we 
could have a spec file dedicated to testing integrations in a test environment. 'integrations.spec.ts' for example.


### STANDARDS:
- Only use soft assertions so we can make assertions throughout the workflow from New to Affirmed.
- When a change to IRD requires automated testing:
    - If you can add the needed assertion(s) to an existing test, without modifying the workflow, do that.
    - If the new assertions can only be made with a new workflow, write a new test.
    - We want to be able to run all tests multiple times a day so new tests should only be created when it's the only option.
- Only use playwrights auto-retrying assertions.
- Use playwrights recommended locators whenever possible.



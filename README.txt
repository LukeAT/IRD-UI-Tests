REQUIREMENTS:
- Node.js


PROJECT SETUP:
1 - When opening for the first time, accept 'recommended extensions' popup.
2 - npm install.
3 - Run the project, should have error about browsers and option to install them, allow this.


COMMANDS:
npx playwright test                             - Run all spec files in parallel, in headless mode. 
npx playwright test tests/outright.spec.ts      - Run a specific test file.
npx playwright test tests/outright.spec.ts:94   - Speciify line test method is declared on to run a specific test.
npx playwright test --ui                        - Run in 'UI Mode'.
npx playwright test --debug                     - Run in debug mode.
npx playwright test --debug --headed            - debug in 'headed mode' (show browsers).


SNIPPETS:      
pw-describe   - New describe block.
pw-test       - New test method.
pw- ...       - Many others available.


FRAMEWORK:
- We do not use Page Objects or the POM, we have User Objects instead. Buyside, Sellside, and Base.
- Tests are run against 1 bs and 1 ss org. 
- Each test suite (spec file) has it's own bs and ss desk and user, permissioned only with each other.
- Tests within a spec file run sequentially. Spec files run in parallel with each other.


STANDARDS:
- Only use soft assertions so we can make assertions throughout the workflow from New to Affirmed.
- When a user story requires automated testing, try integrate the needed assertions into existing e2e tests instead of creating a new test. We want 
to be able to run all tests multiple times a day so new tests should only be created when it's the only option.
- Only use playwrights auto-retrying assertions.
- Only use playwrights recommended locators.



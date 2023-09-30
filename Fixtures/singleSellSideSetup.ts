import { test as base} from '@playwright/test';
import BuysideUser from '../Users/buysideUser';
import SellsideUser from '../Users/sellsideUser';

type MyFixtures = {
    buySide: BuysideUser,
    sellSide: SellsideUser
  };

// Define the test fixture
export const oneSS = base.extend<MyFixtures>({
    buySide: async ({ browser }, use) => {
        const bsContext = await browser.newContext();
        const bsPage = await bsContext.newPage();
        const bs = new BuysideUser(bsPage);

        await use(bs); // Pass the created objects to the test
    },
    sellSide: async ({ browser }, use) => {
        const ssContext = await browser.newContext();
        const ssPage = await ssContext.newPage();
        const ss = new SellsideUser(ssPage);

        await use(ss); // Pass the created objects to the test
    },
});
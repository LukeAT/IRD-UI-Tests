import { expect, test } from '@playwright/test';

import BuysideUser from '../users/buysideUser';
import auth from '../Data/frameworkData/signInDetails.json';

test.describe('test test file.', () => {
  let bs: BuysideUser;

  test.beforeAll(async ({ browser }) => {
    bs = new BuysideUser(await browser.newPage());
    await bs.signIn(auth.INF.bs.username, auth.INF.bs.password);
  });

  test('test test to test testing things', async () => {
    await bs.uploads('outright.tsv');
    await bs.importsRfqAs('RFQ On Rate');
    await expect(bs.blotterStatus()).toHaveText('New');
  });
});

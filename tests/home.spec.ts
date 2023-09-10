import { test, expect, Page } from "@playwright/test";
import Athentication from "../Utils/authenticate"
import shortCode from "../Data/shortcode";
import Archive from "../Utils/archive";

test.describe('Home', () => {

    let auth: Athentication
    let sc: shortCode
    let page: Page

    test.beforeAll(async ({browser}) => {
        page = await browser.newPage();

        auth = new Athentication
        sc = new shortCode(page)
       
        auth.signIn(page, auth.userNames.BuySideOutrightUsername, auth.passwords.BuySideOutrightPassword)
    })

     test.afterEach(async () => {
         Archive.archiveAll('bs@bs.bs', 'bs')
     })

    test('send shortcode', async () => {

        sc.sendShortCode(sc.outright.EUR)
        const button = await page.locator('//*[@id="goFlyMyPretties"]').elementHandle()
        await button?.click()
    
        expect(1).toEqual(1)
    })

})

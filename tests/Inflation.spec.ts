import { test, expect, Page, BrowserContext } from "@playwright/test";
import BuysideUser from "../Users/buysideUser";
import SellsideUser from "../Users/sellsideUser";
import auth from "../Data/signInDetails.json"
import rfqState from "../Data/rfqStates.json"
import sc from "../Data/shortcodes.json"
import setup from "../Helper/setup"


test.describe('Inflation test suite', () => {

    const softExpect = expect.configure({ soft: true });
    test.describe.configure({ retries: 3 });

    //Buyside browser context and pages.
    let bsContext: BrowserContext
    let bsPage: Page
    let bs: BuysideUser

    //Sellside browser context and pages.
    let ssContext: BrowserContext
    let ssPage: Page
    let ss: SellsideUser

    test.beforeAll(async ({ browser }) => {



        bs = new BuysideUser(setup.setup())

        //Instantiate buyside browser-context, context-page and page-objects.
        bsContext = await browser.newContext()
        bsPage = await bsContext.newPage()
        bs = new BuysideUser(bsPage)

        //Instantiate sellside browser-context, context-page and page-objects.
        ssContext = await browser.newContext()
        ssPage = await ssContext.newPage()
        ss = new SellsideUser(ssPage)

        //Sign in to bid.
        await bs.signIn(bsPage, auth.INF.bs.username, auth.INF.bs.password)
        await ss.signIn(ssPage, auth.INF.ss1.username, auth.INF.ss1.password)
    })

    test.beforeEach(async () => {
        await bsPage.goto('/api/bid/archiveallthethingsquickly')
        await ssPage.goto('/')
        await bsPage.goto('/')
    })

    test.afterAll(async () => {
        await bsContext.close()
        await ssContext.close()
    })

    test(`FIRST send INF shortcode and verify rfq status after ss acknowledges`, async () => {

        await bs.sendsShortCode(sc.outright.EUR)
        await ss.ackBtn.click()
        await softExpect(bs.blotterStatus).toHaveText(rfqState.acknowledged)

    })

    test(`SECOND send INF shortcode and verify rfq status after ss acknowledges`, async () => {

        await bs.sendsShortCode('p eur 5y not 44mm')
        await ss.ackBtn.click()
        await softExpect(bs.blotterStatus).toHaveText(rfqState.acknowledged)

    })

    test(`THIRD send INF shortcode and verify rfq status after ss acknowledges`, async () => {

        await bs.sendsShortCode('p eur 5y not 44mm')
        await ss.ackBtn.click()
        await softExpect(bs.blotterStatus).toHaveText(rfqState.acknowledged)

    })
})
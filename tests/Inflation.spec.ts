import { test, expect, Page, BrowserContext } from "@playwright/test";
import BuysideUser from "../Users/buysideUser";
import SellsideUser from "../Users/sellsideUser";
import auth from "../Data/signInDetails.json"
import rfqState from "../Data/rfqStates.json"
import sc from "../Data/shortcodes.json"


test.describe('Inflation test suite', () => {

    const softExpect = expect.configure({ soft: true });
    test.describe.configure({ retries: 3 });

    // bs and ss context and page and user.
    let bsContext: BrowserContext
    let ssContext: BrowserContext
    let bsPage: Page
    let ssPage: Page
    let bs: BuysideUser
    let ss: SellsideUser

    test.beforeAll(async ({ browser }) => {

        //Instantiate bs and ss context, page and user.
        bsContext = await browser.newContext()
        ssContext = await browser.newContext()
        bsPage = await bsContext.newPage()
        ssPage = await ssContext.newPage()
        bs = new BuysideUser(bsPage)
        ss = new SellsideUser(ssPage)

        //Sign in to bid.
        await bs.signIn(bsPage, auth.INF.bs.username, auth.INF.bs.password)
        await ss.signIn(ssPage, auth.INF.ss1.username, auth.INF.ss1.password)

    })

    test.afterEach(async () => {

        await bsPage.goto('/api/bid/archiveallthethingsquickly')

    })

    test.beforeEach(async () => {

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
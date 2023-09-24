import { test, expect, Page, BrowserContext } from "@playwright/test";
import SignIn from "../Components/Shared/signin";
import BuysidePage from "../Components/Buyside/bsPage";
import auth from "../Data/signInDetails.json"
import rfqState from "../Data/rfqStates.json"
import SellsidePage from "../Components/Sellside/ssPage";


test.describe.serial('Inflation test suite', () => {

    //Use soft assertions.
    const sExpect = expect.configure({ soft: true });

    //Buyside browser context and pages.
    let bsContext: BrowserContext
    let bsPage: Page
    let bsSignInPage: SignIn
    let bs: BuysidePage

    //Sellside browser context and pages.
    let ssContext: BrowserContext
    let ssPage: Page
    let ssSignInPage: SignIn
    let ss: SellsidePage

    test.beforeAll(async ({ browser }) => {

        //Instantiate buyside browser-context, context-page and page-objects.
        bsContext = await browser.newContext()
        bsPage = await bsContext.newPage()
        bsSignInPage = new SignIn(bsPage)
        bs = new BuysidePage(bsPage)

        //Instantiate sellside browser-context, context-page and page-objects.
        ssContext = await browser.newContext()
        ssPage = await ssContext.newPage()
        ssSignInPage = new SignIn(ssPage)
        ss = new SellsidePage(ssPage)

        //Sign in to bid.
        await bsSignInPage.signIn(bsPage, auth.INF.bs.username, auth.INF.bs.password)
        await bsPage.goto('/api/bid/archiveallthethingsquickly')
        await bsPage.goto('/')
        await ssSignInPage.signIn(ssPage, auth.INF.ss1.username, auth.INF.ss1.password)
    })

    test.afterEach(async () => {
        await bsPage.goto('/api/bid/archiveallthethingsquickly')
    })

    test.beforeEach(async () => {
        await bsPage.goto('/')
        await ssPage.goto('/')
    })

    test.afterAll(async () => {
        await bsContext.close()
        await ssContext.close()
    })

    test(`FIRST send INF shortcode and verify rfq status after ss acknowledges`, async () => {

        await bs.sendShortCode('p eur 5y not 44mm')
        await ss.ackButton.click()
        await sExpect(bs.blotterStatus).toHaveText(rfqState.acknowledged)

    })

    test(`SECOND send INF shortcode and verify rfq status after ss acknowledges`, async () => {

        await bs.sendShortCode('p eur 5y not 44mm')
        await ss.ackButton.click()
        await sExpect(bs.blotterStatus).toHaveText(rfqState.acknowledged)

    })

    test(`THIRD send INF shortcode and verify rfq status after ss acknowledges`, async () => {

        await bs.sendShortCode('p eur 5y not 44mm')
        await ss.ackButton.click()
        await sExpect(bs.blotterStatus).toHaveText(rfqState.acknowledged)

    })
})
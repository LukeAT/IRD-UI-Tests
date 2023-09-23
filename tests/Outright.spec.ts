import { test, expect, Page, BrowserContext } from "@playwright/test";
import SignIn from "../Components/Shared/signin";
import BuysidePage from "../Components/Buyside/bsPage";
import auth from "../Data/signInDetails.json"
import SendPanel from "../Components/Buyside/sendPanel";
import rfqState from "../Data/rfqStates.json"
import SellsidePage from "../Components/Sellside/ssPage";


test.describe.serial('outright test suite', () => {

    //Use soft assertions.
    const sExpect = expect.configure({ soft: true });

    //Buyside browser context and pages.
    let bsContext: BrowserContext
    let bsPage: Page
    let bsSignInPage: SignIn
    let bs: BuysidePage
    let sendPanel: SendPanel
   
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
        sendPanel = new SendPanel(bsPage)

        //Instantiate sellside browser-context, context-page and page-objects.
        ssContext = await browser.newContext()
        ssPage = await ssContext.newPage()
        ssSignInPage = new SignIn(ssPage)
        ss = new SellsidePage(ssPage)

        //Sign in to bid.
        await bsSignInPage.signIn(bsPage, auth.outright.bs.username, auth.outright.bs.password)
        await bsPage.goto('/api/bid/archiveallthethingsquickly')
        await bsPage.goto('/')
        await ssSignInPage.signIn(ssPage, auth.outright.ss1.username, auth.outright.ss1.password)
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

        test(`FIRST send outright shortcode and verify rfq status after ss acknowledges`, async () => {

            await test.step('GIVEN buyside loads RFQ from Shortcode.', async () => {
                await bs.loadShortcode('p eur 5y not 44mm')
            })
            await test.step('AND buyside sends RFQ.', async () => {

                await bs.blotterSendBtn.click()
                await sendPanel.bankBtn.click()
                await sendPanel.SendBtn.click()

            })
            await test.step('WHEN sellside acknowledges the RFQ.', async () => {
                //await ss.ackButton.click()
            })
            await test.step('THEN buyside can see the status ACKNOWLEDGED for the RFQ.', async () => {
                await sExpect(bs.blotterStatus).toHaveText(rfqState.acknowledged)
            })
        })

        test(`SECOND send outright shortcode and verify rfq status after ss acknowledges`, async () => {

            await test.step('GIVEN buyside loads RFQ from Shortcode.', async () => {
                await bs.loadShortcode('p eur 5y not 44mm')
            })
            await test.step('AND buyside sends RFQ.', async () => {

                await bs.blotterSendBtn.click()
                await sendPanel.bankBtn.click()
                await sendPanel.SendBtn.click()

            })
            await test.step('WHEN sellside acknowledges the RFQ.', async () => {
                await ss.ackButton.click()

            })
            await test.step('THEN buyside can see the status ACKNOWLEDGED for the RFQ.', async () => {
                await sExpect(bs.blotterStatus).toHaveText(rfqState.acknowledged)
            })
        })

        test(`THIRD send outright shortcode and verify rfq status after ss acknowledges`, async () => {

            await test.step('GIVEN buyside loads RFQ from Shortcode.', async () => {
                await bs.loadShortcode('p eur 5y not 44mm')
            })
            await test.step('AND buyside sends RFQ.', async () => {

                await bs.blotterSendBtn.click()
                await sendPanel.bankBtn.click()
                await sendPanel.SendBtn.click()

            })
            await test.step('WHEN sellside acknowledges the RFQ.', async () => {
                await ss.ackButton.click()

            })
            await test.step('THEN buyside can see the status ACKNOWLEDGED for the RFQ.', async () => {
                await sExpect(bs.blotterStatus).toHaveText(rfqState.acknowledged)
            })
        })
})
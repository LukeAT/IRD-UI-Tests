import { test, expect, Page, BrowserContext } from "@playwright/test";
import SignIn from "../Components/Shared/signin";
import BuysidePage from "../Components/Buyside/bsPage";
import auth from "../Data/signInDetails.json"
import SendPanel from "../Components/Buyside/sendPanel";
import rfqState from "../Data/rfqStates.json"
import SellsidePage from "../Components/Sellside/ssPage";


test.describe.serial('basis tests', () => {

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
        bsSignInPage.signIn(bsPage, auth.outright.BSUsr.userOne.username, auth.outright.BSUsr.userOne.password)
        ssSignInPage.signIn(ssPage, auth.outright.SSUsr.userOne.username, auth.outright.SSUsr.userOne.password)
    })

    test.afterEach(async () => {
        await bsPage.goto('/api/bid/archiveallthethingsquickly')
    })

    test.afterAll(async () => {
        await bsContext.close()
        await ssContext.close()
    })

        test(`FIRST send inflation shortcode and verify rfq status after ss acknowledges`, async () => {

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
                sExpect(await bs.blotterStatus(1)).toBe(rfqState.acknowledged)
            })
        })

        test(`SECOND send inflation shortcode and verify rfq status after ss acknowledges`, async () => {

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
                sExpect(await bs.blotterStatus(1)).toBe(rfqState.acknowledged)
            })
        })

        test(`THIRD send inflation shortcode and verify rfq status after ss acknowledges`, async () => {

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
                sExpect(await bs.blotterStatus(1)).toBe(rfqState.acknowledged)
            })
        })
})
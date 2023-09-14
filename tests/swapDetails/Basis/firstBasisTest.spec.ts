import { test, expect, Page, BrowserContext } from "@playwright/test";
import SignIn from "../../../Components/signin";
import BasePage from "../../../Components/basePage";
import auth from "../../../Data/signInDetails.json"
import SendPanel from "../../../Components/sendPanel";


test.describe('basis tests', () => {

    //Use soft assertions.
    const sExpect = expect.configure({ soft: true });

    //Buyside browser context and pages.
    let bsContext: BrowserContext
    let bsPage: Page
    let bsSignInPage: SignIn
    let bsBasePage: BasePage
   
    //Sellside browser context and pages.
    let ssContext: BrowserContext
    let ssPage: Page
    let ssSignInPage: SignIn
    let ssBasePage: BasePage
    let sendPanel: SendPanel

    test.beforeAll(async ({ browser }) => {

        //Instantiate buyside browser-context, context-page and page-objects.
        bsContext = await browser.newContext()
        bsPage = await bsContext.newPage()
        bsSignInPage = new SignIn(bsPage)
        bsBasePage = new BasePage(bsPage)
        sendPanel = new SendPanel(bsPage)

        //Instantiate sellside browser-context, context-page and page-objects.
        ssContext = await browser.newContext()
        ssPage = await ssContext.newPage()
        ssSignInPage = new SignIn(ssPage)
        ssBasePage = new BasePage(ssPage)

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

        test(`send outright shortcode and verify rfq status after ss acknowledges`, async () => {

            await test.step('GIVEN buyside loads RFQ from Shortcode.', async () => {
                bsBasePage.loadShortcode('p usd 5y not 44mm')
            })
            await test.step('AND buyside sends RFQ.', async () => {

                await bsBasePage.blotterSendBtn.click()
                await sendPanel.bankBtn.click()
                await sendPanel.SendBtn.click()

            })
            await test.step('WHEN sellside acknowledges the RFQ.', async () => {
                ssBasePage.ackButton.click()

            })
            await test.step('THEN buyside can see the status ACKNOWLEDGED for the RFQ.', async () => {
                await sExpect(bsPage.locator('.State--Acknowledged--3IDo1')).toHaveText("ACKNOWLEDGED")
            })
        })
    

})
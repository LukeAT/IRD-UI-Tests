import { test, expect, Page, BrowserContext } from "@playwright/test";
import SignIn from "../Components/signin";
import BasePage from "../Components/basePage";
import auth from "../Data/signInDetails.json"
import sc from "../Data/shortcodes.json"
import rfqState from "../Data/rfqStates.json"
import SendPanel from "../Components/sendPanel";


test.describe('outrightTests', () => {

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

    //Arrays for test parameterisation.
    let testShortCodes: string[] = []
    let expectedRFQStates: string[] = []

    test.beforeAll(async ({ browser }) => {

        //Instantiate buyside browser-context, context-page and page-objects.
        bsContext = await browser.newContext()
        bsPage = await bsContext.newPage()
        bsSignInPage = new SignIn(bsPage)
        bsBasePage = new BasePage(bsPage)

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

    testShortCodes = [
        sc.basis.close
    ]

    expectedRFQStates = [
        rfqState.acknowledged,
        rfqState.affirmed,
        rfqState.done
    ]

    for (let i = 0; i < testShortCodes.length; i++) {
        test(`send five outright shortcode and receive 5 correct RFQ states.${i}`, async () => {

            await test.step('GIVEN buyside loads RFQ from Shortcode.', async () => {
                bsBasePage.loadShortcode(testShortCodes[i])
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
                await sExpect(bsPage.locator('.State--Acknowledged--3IDo1')).toHaveText(expectedRFQStates[i])
            })
        })
    }

})

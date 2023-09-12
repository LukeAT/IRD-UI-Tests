import { test, expect, Page, BrowserContext } from "@playwright/test";
import SignIn from "../Components/signin";
import BasePage from "../Components/basePage";
import auth from "../Data/signInDetails.json"
import sc from "../Data/shortcodes.json"
import rfqState from "../Data/rfqStates.json"


test.describe('outrightTests', () => {

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
        await bsPage.close()
        await ssPage.close()
    })

    testShortCodes = [
        sc.outright.EUR, 
        sc.outright.GBP, 
        sc.outright.USD
    ]

    expectedRFQStates = [
        rfqState.acknowledged,
        rfqState.affirmed,
        rfqState.done
    ]

    for (let i = 0; i < testShortCodes.length; i++) {
        test(`send five outright shortcode ${i} and receive 5 correct RFQ states.`, async () => {

            await test.step('GIVEN buyside loads RFQ from Shortcode.', async () => {
                bsBasePage.loadShortcode(testShortCodes[i])
            })
            await test.step('AND buyside sends RFQ.', async () => {

                const blotterSendBtn = bsPage.getByRole("button").filter({ hasText: "Send" })
                const bankBtn = bsPage.locator('//*[@id="MWMEGA-desk233-org70"]')
                const sendPanelSendBtn = bsPage.locator("//button[@id='submitButton']")

                await blotterSendBtn.click()
                await bankBtn.click()
                await sendPanelSendBtn.click()

            })
            await test.step('WHEN sellside acknowledges the RFQ.', async () => {
                const ackBtn = ssPage.getByRole("button").filter({ hasText: "Acknowledge" })
                await ackBtn.click()

            })
            await test.step('THEN buyside can see the status ACKNOWLEDGED for the RFQ.', async () => {
                await expect(bsPage.locator('.State--Acknowledged--3IDo1')).toHaveText(expectedRFQStates[i])
            })
        })
    }

})

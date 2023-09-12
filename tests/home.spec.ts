import { test, expect, Page, BrowserContext } from "@playwright/test";
import SignIn from "../Components/signin";
import BasePage from "../Components/basePage";
import auth from "../Data/signInDetails.json"
import sc from "../Data/shortcodes.json"


test.describe('outrightTests', () => {

    let bsContext: BrowserContext
    let ssContext: BrowserContext
    let bsPage: Page
    let ssPage: Page
    let bsSignInPage: SignIn
    let ssSignInPage: SignIn
    let bsBasePage: BasePage
    let ssBasePage: BasePage
    let testShortCodes: string[] = []
    let ExpectedRFQStates: string[] = []

    test.beforeAll(async ({ browser }) => {

        //Create bs and ss browser contexts.
        bsContext = await browser.newContext()
        ssContext = await browser.newContext()

        //Create bs and ss pages within respective contexts.
        bsPage = await bsContext.newPage()
        ssPage = await ssContext.newPage()

        //Instantiate bs page objects.
        bsSignInPage = new SignIn(bsPage)
        bsBasePage = new BasePage(bsPage)

        //Instantiate ss page objects.
        ssSignInPage
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
        sc.outright.EUR, sc.outright.GBP, sc.outright.USD
    ]

    ExpectedRFQStates = [
        RFQState.acknowledged,
        RFQState.new,
        RFQState.quoted
    ]

    for (const shortCode of testShortCodes) {
        test(`send ${shortCode} and receive ${ExpectedRFQStates[send]}.`, async () => {

            await test.step('GIVEN buyside loads RFQ from Shortcode.', async () => {
                bsBasePage.loadShortcode(outrightShortCode[i])
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
                await expect(bsPage.locator('.State--Acknowledged--3IDo1')).toHaveText(ExpectedRFQState[i])
            })
        })
    }

})

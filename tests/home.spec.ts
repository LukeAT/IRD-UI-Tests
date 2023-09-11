import { test, expect, Page, BrowserContext } from "@playwright/test";
import SignIn from "../Components/signin";
import BasePage from "../Components/basePage";

test.describe('Home', () => {

    let bsContext: BrowserContext
    let ssContext: BrowserContext
    let bsPage: Page
    let ssPage: Page
    let bsBasePage: BasePage
    let ssBasePage: BasePage
    let signIn: SignIn
    let outrightShortCode: string[] = []
    let ExpectedRFQState: string[] = []

    test.beforeAll(async ({ browser }) => {

        //Create bs and ss browser contexts.
        bsContext = await browser.newContext()
        ssContext = await browser.newContext()

        //Create bs and ss pages within respective contexts.
        bsPage = await bsContext.newPage()
        ssPage = await ssContext.newPage()

        //Instantiate bs page objects.
        bsBasePage = new BasePage(bsPage)

        //Instantiate ss page objects.
        ssBasePage = new BasePage(ssPage)

        //Sign in to bid.
        signIn.signIn(bsPage, User.bsUser.Outright, User.bsPwd.Outright)
        signIn.signIn(ssPage, User.ssUser.Outright, User.ssPwd.Outright)
    })

    test.afterEach(async () => {
        await bsPage.goto('/api/bid/archiveallthethingsquickly')
    })

    test.afterAll(async () => {
        await bsPage.close()
        await ssPage.close()
    })

    outrightShortCode = [
        Shortcodes.outright.GBP,
        Shortcodes.XCSFixFloat.EUR,
        Shortcodes.outright.USD
    ]

    ExpectedRFQState = [
        RFQState.State.acknowledged,
        RFQState.State.done,
        RFQState.State.quoted
    ]

    for (const i of outrightShortCode) {
        test(`send ${outrightShortCode[i]} and receive ${ExpectedRFQState[i]}.`, async () => {

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

import { test, expect, Page, BrowserContext } from "@playwright/test";
import SignIn from "../Components/signin";
import BasePage from "../Components/basePage";

test.describe('Home', () => {

    let bsContext: BrowserContext
    let ssContext: BrowserContext
    let bsPage: Page
    let ssPage: Page
    let signIn: SignIn
    let outrightShortCode: string[] = []
    let ExpectedRFQState: string[] = []

    test.beforeAll(async ({ browser }) => {

        bsContext = await browser.newContext()
        ssContext = await browser.newContext()

        bsPage = await bsContext.newPage()
        ssPage = await ssContext.newPage()

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
        ShortCodes.outright.GBP,
        ShortCodes.XCSFixFloat.EUR,
        ShortCodes.outright.USD
    ]

    ExpectedRFQState = [
        RFQState.State.acknowledged,
        RFQState.State.done,
        RFQState.State.quoted
    ]

    for (const i of outrightShortCode) {
        test(`send ${outrightShortCode[i]} and receive ${ExpectedRFQState[i]}.`, async () => {

            await test.step('GIVEN buyside loads RFQ from Shortcode.', async () => {
                BasePage.loadShortcode(outrightShortCode[i])
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

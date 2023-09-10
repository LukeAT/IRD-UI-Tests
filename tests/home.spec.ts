import { test, expect, Page } from "@playwright/test";
import Athenticate from "../Utils/authenticate"

test.describe('Home', () => {

    let bsPage: Page
    let ssPage: Page
    let auth: Athenticate
    let outrightShortCode: string[] = []
    let ExpectedRFQState: string[] = []

    test.beforeAll(async ({ browser }) => {
        bsPage = await browser.newPage()
        ssPage = await browser.newPage()
        auth = new Athenticate

        auth.signIn(bsPage, User.bsUser.Outright, User.bsPwd.Outright)
        auth.signIn(ssPage, User.ssUser.Outright, User.ssPwd.Outright)
    })

    test.afterEach(async () => {
        await bsPage.goto('/api/bid/archiveallthethingsquickly')
    })

    test.afterAll(async () => {
        await bsPage.close()
        await ssPage.close()

    })


    for (const i of outrightShortCode) {

        outrightShortCode = [
            ShortCodes.outright.GBP, //1
            ShortCodes.XCSFixFloat.EUR, //2
            ShortCodes.outright.USD //3
        ]

        ExpectedRFQState = [
            RFQStates.State.acknowledged, //1
            RFQStates.State.quoted, //2
            RFQStates.State.done //3
        ]

        test(`send ${outrightShortCode[i]} and receive ${ExpectedRFQState[i]}.`, async () => {

            await test.step('GIVEN buyside loads RFQ from Shortcode.', async () => {
                sc.sendShortCode(outrightShortCode[i])
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

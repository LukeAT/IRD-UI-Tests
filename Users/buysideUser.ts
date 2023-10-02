import { Locator, Page } from "@playwright/test";
import BasePage from "./baseUser";

export default class BuysideUser extends BasePage {

    readonly page: Page

    // Load shortcode.
    readonly shortCodeInput: Locator
    readonly goButton: Locator

    // Send RFQ.
    readonly blotterSendBtn: Locator
    readonly bankBtn: Locator;
    readonly SendBtn: Locator;
    readonly errormsg: Locator;
   

    // Quoting panel.
    readonly qPanelBestBid: Locator;
    readonly qPanelBestOffer: Locator;


    constructor(page: Page) {

        super(page)
        this.page = page

        // Load shortcode.
        this.shortCodeInput = page.locator('//input[@id="shortCodeEntry"]')
        this.goButton = page.locator('//*[@id="goFlyMyPretties"]')

        // Send RFQ.
        this.blotterSendBtn = page.getByRole("button").filter({ hasText: "Send" })
        this.bankBtn = page.getByRole("button").filter({ hasText: 'MWMEGA' })
        this.SendBtn = page.locator("//button[@id='submitButton']")
        this.errormsg = page.getByText('An error occurred.')

        // Quoting panel
        this.qPanelBestBid = page.locator("//button[@id='btnAwardBid']")
        this.qPanelBestOffer = page.locator("//button[@id='btnAwardOffer']")

    }

    async sendsShortCode(shortcode: string) {

        let errorVisible = false

        await this.shortCodeInput.fill(shortcode)
        await this.goButton.click()
        await this.blotterSendBtn.click()
        await this.bankBtn.click()
        await this.SendBtn.click()

        await this.errormsg.waitFor({state:"visible", timeout: 3000}).catch(console.log)

        if (await this.errormsg.isVisible()) {
            errorVisible = true
        }

        while (errorVisible === true) {
            await this.SendBtn.click()
            await this.errormsg.waitFor({state:"visible", timeout: 3000}).catch(console.log)
            if (!await this.errormsg.isVisible()) {
                errorVisible = false
            } 
        }
    }

    async awardsBest(offerOrBid: string){
        if(offerOrBid === "bid") {
            this.qPanelBestBid.click()
        } else if (offerOrBid === "offer") {
            this.qPanelBestOffer.click()
        } else {
            console.log("unrecognised award value")
        }
    }




}
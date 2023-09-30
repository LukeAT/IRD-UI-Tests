import { Locator, Page } from "@playwright/test";
import BasePage from "./baseUser";

export default class BuysideUser extends BasePage {

    readonly page: Page

    // Send shortcodes.
    readonly shortCodeInput: Locator
    readonly goButton: Locator

    // Blotter action.
    readonly blotterSendBtn: Locator

    // Send panel.
    readonly bankBtn: Locator;
    readonly SendBtn: Locator;
    readonly errormsg: Locator;


    constructor(page: Page) {

        super(page)
        this.page = page
        this.shortCodeInput = page.locator('//input[@id="shortCodeEntry"]')
        this.goButton = page.locator('//*[@id="goFlyMyPretties"]')
        this.blotterSendBtn = page.getByRole("button").filter({ hasText: "Send" })
        this.bankBtn = page.getByRole("button").filter({ hasText: 'MWMEGA' })
        this.SendBtn = page.locator("//button[@id='submitButton']")
        this.errormsg = page.getByText('An error occurred.')
        this.SendBtn = page.locator("//button[@id='submitButton']")
        
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
}
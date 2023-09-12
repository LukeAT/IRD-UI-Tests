import { Page, Locator } from "@playwright/test";

export default class BasePage {

    private readonly page: Page;
    readonly shortCodeInput: Locator;
    readonly irsTab: Locator;
    readonly goButton: Locator;
    readonly blotterSendBtn: Locator;

    constructor(page: Page){
        this.page = page
        this.irsTab = page.getByText('IRS')
        this.shortCodeInput = page.locator('//input[@id="shortCodeEntry"]')
        this.goButton = page.locator('//*[@id="goFlyMyPretties"]')
        this.blotterSendBtn = page.getByRole("button").filter({ hasText: "Send" })        
    }

    async loadShortcode(shortcode: string) {
        await this.shortCodeInput.clear()
        await this.shortCodeInput.fill(shortcode)
        await this.goButton.click()
    }

}
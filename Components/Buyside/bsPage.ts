import { Locator, Page } from "@playwright/test";
import BasePage from "../Shared/basePage";

export default class BuysidePage extends BasePage {

    readonly page: Page
    readonly goButton: Locator
    readonly blotterSendBtn: Locator
    readonly shortCodeInput: Locator;

    constructor(page: Page) {
        super(page)
        this.page = page
        this.shortCodeInput = page.locator('//input[@id="shortCodeEntry"]')
        this.goButton = page.locator('//*[@id="goFlyMyPretties"]')
        this.blotterSendBtn = page.getByRole("button").filter({ hasText: "Send" })
    }

    async loadShortcode(shortcode: string) {
        await this.irsTab.click()
        await this.shortCodeInput.clear()
        await this.shortCodeInput.fill(shortcode)
        await this.goButton.click()
    }
}
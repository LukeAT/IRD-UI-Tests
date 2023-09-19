import { Page, Locator } from "@playwright/test";

export default class BasePage {

    readonly page: Page // Can i delete this and in the constructor?
    readonly irsTab: Locator
    readonly blotterStatus: Locator

    constructor(page: Page) {

        this.page = page
        this.irsTab = page.getByText('IRS')
        this.blotterStatus = page.locator("//div[@id='statusIdCell']").first()

    }
}
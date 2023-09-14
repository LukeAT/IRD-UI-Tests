import { Locator, Page } from "@playwright/test";

export default class SendPanel {

    readonly page: Page // Can i delete this and in the constructor?
    readonly bankBtn: Locator;
    readonly SendBtn: Locator;

    constructor(page: Page) {
        this.page = page
        this.bankBtn = page.locator('//*[@id="SS1-desk2-org3"]')
        this.SendBtn = page.locator("//button[@id='submitButton']")
    }

}


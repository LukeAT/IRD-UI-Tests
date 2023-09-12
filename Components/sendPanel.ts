import { Locator, Page } from "@playwright/test";

export default class sendPanel {

    readonly bankBtn: Locator;
    readonly SendBtn: Locator;

    constructor(page: Page) {
        this.bankBtn = page.locator('//*[@id="MWMEGA-desk233-org70"]')
        this.SendBtn = page.locator("//button[@id='submitButton']")
    }

}


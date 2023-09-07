import { Page, Locator } from "@playwright/test";

class Blotter {
    page: Page;
    shortCodeInput: Locator;
    irsTab: Locator;
    goButton: Locator;

    constructor(page: Page){
        this.page = page
        this.irsTab = page.getByText('IRS')
        this.shortCodeInput = page.locator('//input[@id="shortCodeEntry"]')
        this.goButton = page.locator('//*[@id="goFlyMyPretties"]')
    }

    async goToHomePage() {
        await this.page.goto('https://uat3.otcxtrading.com')
    }
}

export default Blotter;
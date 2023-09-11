import { Page, Locator } from "@playwright/test";

class BasePage {

    private page: Page;
    shortCodeInput: Locator;
    irsTab: Locator;
    goButton: Locator;

    constructor(page: Page){
        this.page = page
        this.irsTab = page.getByText('IRS')
        this.shortCodeInput = page.locator('//input[@id="shortCodeEntry"]')
        this.goButton = page.locator('//*[@id="goFlyMyPretties"]')
    }
       
}

export default BasePage;
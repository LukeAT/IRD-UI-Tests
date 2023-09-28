import { Locator, Page } from "@playwright/test";
import BasePage from "./baseUser";

export default class SellsideUser extends BasePage {

    readonly page: Page
    readonly ackButton: Locator

    constructor(page: Page) {
       
        super(page)
        this.page = page
        this.ackButton = page.getByRole("button").filter({ hasText: "Acknowledge" })    
    }

    async acknowledges () {
        this.ackButton.click()
    }
}
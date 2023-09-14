import { Locator, Page } from "@playwright/test";
import BasePage from "../Shared/basePage";

export default class SellsidePage extends BasePage {

    readonly page: Page
    readonly ackButton: Locator

    constructor(page: Page) {
       
        super(page)
        this.page = page
        this.ackButton = page.getByRole("button").filter({ hasText: "Acknowledge" })    
    }
}
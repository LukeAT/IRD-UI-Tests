import { Locator, Page } from "@playwright/test";
import BasePage from "./baseUser";

export default class SellsideUser extends BasePage {

    readonly page: Page
    readonly ackBtn: Locator

    constructor(page: Page) {
       
        super(page)
        this.page = page
        this.ackBtn = page.getByRole("button").filter({ hasText: "Acknowledge" })    
    }

}
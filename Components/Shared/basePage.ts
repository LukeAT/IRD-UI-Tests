import { Page, Locator } from "@playwright/test";

export default class BasePage {

    readonly page: Page // Can i delete this and in the constructor?
    readonly irsTab: Locator    

    constructor(page: Page){
        
        this.page = page
        this.irsTab = page.getByText('IRS')    
        
    }

    //Returns the rfq state shown in blotter, enter 1 for first row, 2 for second etc.
    async blotterStatus (row: number) {
        return await this.page.locator("(//div[@id='statusIdCell'])[" + row + "]").innerText()
    }

  

    

}
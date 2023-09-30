import { Browser } from "@playwright/test";

export default class Setup {

    static async setup(browser: Browser) {
        const context = await browser.newContext()
        const page = await context.newPage()

        return page
    }
    
}
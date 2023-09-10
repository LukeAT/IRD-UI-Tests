import { Page } from "@playwright/test"
import Blotter from "../Components/blotter"

class SendShortcode {

    page: Page

    constructor(page: Page) {
        this.page = page
    }

    async sendShortCode(shortCode: string) {
        const p = new Blotter(this.page)

        await p.irsTab.click()
        await p.shortCodeInput.fill(shortCode)
        await p.goButton.click()
    }
}

export default SendShortcode
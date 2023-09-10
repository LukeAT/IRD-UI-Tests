import { Page } from "@playwright/test"
import Blotter from "../Components/blotter"

class shortCode {

    page: Page

    constructor(page: Page) {
        this.page = page
    }

    outright = {
        EUR: "P EUR 5Y NOT 100MM",
    }

    XCSFixFloat = {
        EUR: "P EUR 5Y NOT 100MM",
    }

    async sendShortCode(shortCode: string) {
        const p = new Blotter(this.page)

        await p.irsTab.click()
        await p.shortCodeInput.fill(shortCode)
        await p.goButton.click()
    }
}

export default shortCode
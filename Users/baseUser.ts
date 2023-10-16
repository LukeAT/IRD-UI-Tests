import { Page, Locator } from "@playwright/test";

export default class BaseUser {

    readonly page: Page

    // Sign-in.
    private readonly signInPwd: Locator
    private readonly signInEmail: Locator
    private readonly logInBtn: Locator
    private readonly enablePopUp: Locator
    private readonly remindMePopUp: Locator

    readonly blotterStatus: Locator

    // Inspector.
    readonly summaryTab: Locator
    readonly winningQuote: Locator
    readonly mainEconNotional: Locator
    readonly mainEconBankSide: Locator
    readonly acceptDetailsBtn: Locator

    // Enter/Accept details modal.
    readonly dmPremiumDir: Locator
    readonly dmPremiumCents: Locator
    readonly dmDxDirDropDown: Locator
    readonly dmPremiumCash: Locator
    readonly dmDxDir: Locator
    readonly dmDxNot: Locator

    // General actions.
    readonly AcceptBtn: Locator

    // Inspector tabs.
    readonly swnTab: Locator

    
    constructor(page: Page) {

        this.page = page
        this.signInEmail = page.locator('#Email')
        this.signInPwd = page.locator('#Password')
        this.logInBtn = page.getByRole('button').filter({ hasText: 'Log In' })
        this.enablePopUp = page.getByRole('button').filter({ hasText: 'Enable' })
        this.remindMePopUp = page.getByRole('button').filter({ hasText: 'Remind Me in 14 days.' })
        this.blotterStatus = page.locator("//div[@id='statusIdCell']").first()

        // Blotter actions.
        this.acceptDetailsBtn = page.getByRole('button').filter({ hasText: 'Accept Details' }).first()


        // Inspector.
        this.summaryTab = page.locator("#tabSummary")
        this.winningQuote = page.locator("#dealSummaryWinningQuote")
        this.mainEconNotional = page.locator("#notional0")
        this.mainEconBankSide = page.locator("#mainEconomicsBankSide0")


        // Accept details.
        this.dmPremiumDir = page.locator("#totalPremiumDirection")
        this.dmPremiumCents = page.locator("#totalPremiumRate")
        this.dmPremiumCash = page.locator("#totalPremiumCash")
        this.dmDxDirDropDown = page.locator('select[name="totalDirection"]')
        this.dmDxDir = page.locator("#totalDeltaExchangeDirection")
        this.dmDxNot = page.locator("#totaldeltaExchange")


        // General actions.
        this.AcceptBtn = page.locator('#submitButton')

        // Inpector tabs.
        this.swnTab = page.locator('a').filter({ hasText: 'SWAPTION' })


    }
    

    async signIn(page: Page, username: string, password: string) {

        // Uses base URL in plawyright.config.
        page.goto('/')

        // Sign-in modal.
        await this.signInEmail.fill(username)
        await this.signInPwd.fill(password)
        await this.logInBtn.click()

        // Get through first time sign in pop-ups.
        await this.enablePopUp.click()
        await this.remindMePopUp.click()

    }

    async clicksAccept() {

        this.AcceptBtn.click()
    
    }

    async clicksSwnTab() {
        this.swnTab.click()
    }

    
}
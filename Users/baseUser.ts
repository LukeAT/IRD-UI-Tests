import { Page } from "@playwright/test";

export default class BaseUser {

    page: Page;

    // Sign-in.
    private readonly signInEmail = () => this.page.locator('#Email')
    private readonly signInPwd = () => this.page.locator('#Password')
    private readonly logInBtn = () => this.page.getByRole('button').filter({ hasText: 'Log In' })
    private readonly enablePopUp = () => this.page.getByRole('button').filter({ hasText: 'Enable' })
    private readonly remindMePopUp = () =>this.page.getByRole('button').filter({ hasText: 'Remind Me in 14 days.' })

    // Blotter row.
    readonly blotterStatus = () => this.page.locator("//div[@id='statusIdCell']").first()

    // Blotter actions.
    readonly acceptDetailsBtn = () => this.page.getByRole('button').filter({ hasText: 'Accept Details' }).first()

    // Inspector.
    readonly summaryTab = () => this.page.locator("#tabSummary")
    readonly winningQuote = () => this.page.locator("#dealSummaryWinningQuote")
    readonly mainEconNotional = () => this.page.locator("#notional0")
    readonly mainEconBankSide = () => this.page.locator("#mainEconomicsBankSide0")

    // Enter/Accept details modal.
    readonly dmPremiumDir = () => this.page.locator("#totalPremiumDirection")
    readonly dmPremiumCents = () => this.page.locator("#totalPremiumRate")
    readonly dmDxDirDropDown = () => this.page.locator('select[name="totalDirection"]')
    readonly dmPremiumCash = () => this.page.locator("#totalPremiumCash")
    readonly dmDxDir = () => this.page.locator("#totalDeltaExchangeDirection")
    readonly dmDxNot = () => this.page.locator("#totaldeltaExchange")

    // General actions.
    readonly AcceptBtn = () => this.page.locator('#submitButton')

    // Inspector tabs.
    readonly swnTab = () => this.page.locator('a').filter({ hasText: 'SWAPTION' })

    constructor(page: Page) {

        this.page = page

    }

    async goHome() { await this.page.goto('/') }
    
    async signIn(username: string, password: string) {

        // Uses base URL in plawyright.config.
        await this.page.goto('/')

        // Sign-in modal.
        await this.signInEmail().fill(username)
        await this.signInPwd().fill(password)
        await this.logInBtn().click()

        // Get through first time sign in pop-ups.
        await this.enablePopUp().click()
        await this.remindMePopUp().click()

    }

    async clicksAccept() { await this.AcceptBtn().click() }

    async clicksSwnTab() { await this.swnTab().click() }

    
}
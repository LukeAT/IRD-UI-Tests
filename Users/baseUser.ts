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
    readonly summaryTab: Locator;
    readonly dealSumWinningQuote: Locator;
    readonly mainEconNotional: Locator;
    readonly mainEconBankSide: Locator;
    readonly acceptDetailsBtn: Locator;

    // Accept details.
    readonly PremiumDir: Locator;
    readonly premiumCents: Locator;
    readonly premiumCash: Locator;
    readonly DxDir: Locator;
    readonly DxNot: Locator;

    // General actions.
    readonly AcceptBtn: Locator;

    
    constructor(page: Page) {

        this.page = page
        this.signInEmail = page.locator('#Email')
        this.signInPwd = page.locator('#Password')
        this.logInBtn = page.getByRole('button').filter({ hasText: 'Log In' })
        this.enablePopUp = page.getByRole('button').filter({ hasText: 'Enable' })
        this.remindMePopUp = page.getByRole('button').filter({ hasText: 'Remind Me in 14 days.' })
        this.blotterStatus = page.locator("//div[@id='statusIdCell']").first()

        // Blotter actions.
        this.acceptDetailsBtn = page.getByRole('button').filter({ hasText: 'Accept Details' })


        // Inspector.
        this.summaryTab = page.locator("#tabSummary")
        this.dealSumWinningQuote = page.locator("#dealSummaryWinningQuote")
        this.mainEconNotional = page.locator("#mainEconomicsNotional0")
        this.mainEconBankSide = page.locator("#mainEconomicsBankSide0")


        // Accept details.
        this.PremiumDir = page.locator("#totalPremiumDirection")
        this.premiumCents = page.locator("#totalPremiumRate")
        this.premiumCash = page.locator("#totalPremiumCash")
        this.DxDir = page.locator("#totalDeltaExchangeDirection")
        this.DxNot = page.locator("#totaldeltaExchange")


        // General actions.
        this.AcceptBtn = page.locator('#submitButton')


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

    
}
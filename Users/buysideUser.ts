import { Locator, Page } from "@playwright/test";
import BasePage from "./baseUser";
import path from 'path';


export default class BuysideUser extends BasePage {

    readonly page: Page

    // Load shortcode.
    private readonly shortCodeInput: Locator
    private readonly goBtn: Locator

    // Staging.
    private readonly goToStagingBtn: Locator
    private readonly selectAllBtn: Locator

    // Send RFQ.
    private readonly blotterSendBtn: Locator
    private readonly SendBtn: Locator
    private readonly errormsg: Locator
    private readonly withDeltaExchange: Locator
    private readonly dxNotional: Locator
    private readonly atmForwardRate: Locator
    private readonly oneWay: Locator

    // Quoting panel.
    readonly qPanelBestBid: Locator
    readonly qPanelBestOffer: Locator


    constructor(page: Page) {

        super(page)
        this.page = page

        // Load shortcode.
        this.shortCodeInput = page.locator('//input[@id="shortCodeEntry"]')
        this.goBtn = page.locator('//*[@id="goFlyMyPretties"]')

        // Go to Staging.
        this.goToStagingBtn = page.locator('#gotoimportid')
        this.selectAllBtn = page.locator('#btnSelectAll')

        // Send RFQ.
        this.blotterSendBtn = page.getByRole("button").filter({ hasText: "Send" })
        this.SendBtn = page.locator("//button[@id='submitButton']")
        this.errormsg = page.getByText('An error occurred.')
        this.withDeltaExchange = page.getByLabel('With Delta Exchange')
        this.dxNotional = page.locator('#deltaExchangeInputField')
        this.atmForwardRate = page.locator('#forwardRefRateInputField')
        this.oneWay = page.getByLabel('One Way')

        // Quoting panel.
        this.qPanelBestBid = page.locator("//button[@id='btnAwardBid']")
        this.qPanelBestOffer = page.locator("//button[@id='btnAwardOffer']")

    }

    async uploads(fileName: string) {

        await this.page.evaluate(() => {
            return fetch('https://uat3.otcxtrading.com/api/import/ArchiveStagedEntries')
        });

        const filePath = path.join(__dirname, '../Data/RFQs/' + fileName)
        await this.page.setInputFiles('#irsselectfiletoimport', filePath)

    }

    async importsRfqAs(importType: string) {

        const stagingImportTypeBtn = this.page.getByRole("button").filter({ hasText: importType })

        await this.goToStagingBtn.click()
        await this.selectAllBtn.click()
        await stagingImportTypeBtn.click()

    }

    async loadsShortCode(shortcode: string) {

        await this.shortCodeInput.fill(shortcode)
        await this.goBtn.click()

    }

    async sendsRFQ(options?: { 

        bank2?: string 
        oneWay?: boolean, 
        withDeltaX?: boolean, 
        dxNot?: string, 
        atmFr?: string 

    }) {

        await this.blotterSendBtn.click()

        // Bank 1 is hard coded as it is always selected.
        await this.page.getByRole('button', { name: 'MWMEGA' }).click()

        // Apply options.
        if (options?.bank2 !== undefined) { await this.page.getByRole("button").filter({ hasText: options.bank2 }).click() }
        if (options?.oneWay === true) { await this.oneWay.click() }
        if (options?.withDeltaX === true) { await this.withDeltaExchange.check() }
        if (options?.dxNot !== undefined) { await this.dxNotional.fill(options.dxNot) }
        if (options?.atmFr !== undefined) { await this.atmForwardRate.fill(options.atmFr) }

        await this.SendBtn.click()

        // TODO: Handle this error better so it doesn't show as a fail and doesn't log to console.
        // Handle 'An error occurred' message that sometimes happens possibly due to deadlock.
        let errorVisible = false

        await this.errormsg.waitFor({ state: "visible", timeout: 3000 }).catch(console.log)

        if (await this.errormsg.isVisible()) {
            errorVisible = true
        }

        while (errorVisible === true) {
            await this.SendBtn.click()
            await this.errormsg.waitFor({ state: "visible", timeout: 3000 }).catch(console.log)
            if (!await this.errormsg.isVisible()) {
                errorVisible = false
            }
        }
    }

    async awardsBest(quote: string) {

        if (quote === "bid") {
            await this.qPanelBestBid.click()
        } else if (quote === "offer") {
            await this.qPanelBestOffer.click()
        } else {
            console.log("Unrecognised quote value for awardsBest method.")
        }

    }

    async clicksSummaryTab() {
        await this.summaryTab.click()
    }

    async clicksAcceptsDetails() {

        await this.acceptDetailsBtn.click()

    }
}
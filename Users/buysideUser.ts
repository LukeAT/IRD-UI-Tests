import { Page } from "@playwright/test";
import BasePage from "./baseUser";
import path from 'path';


export default class BuysideUser extends BasePage  {

    page: Page;

    // Load shortcode.
    private readonly shortCodeInput = () => this.page.locator('#shortCodeEntry')
    private readonly goBtn = () => this.page.locator('#goFlyMyPretties')

    // Staging.
    private readonly goToStagingBtn = () => this.page.locator('#gotoimportid')
    private readonly selectAllBtn = () => this.page.locator('#btnSelectAll')

    // Send RFQ.
    private readonly blotterSendBtn = () => this.page.getByRole("button").filter({ hasText: "Send" })
    private readonly SendBtn = () => this.page.locator('#submitButton')
    private readonly errormsg = () => this.page.getByText('An error occurred.')
    private readonly withDeltaExchange = () => this.page.getByLabel('With Delta Exchange')
    private readonly dxNotional = () => this.page.locator('#deltaExchangeInputField')
    private readonly atmForwardRate = () => this.page.locator('#forwardRefRateInputField')
    private readonly oneWay = () => this.page.getByLabel('One Way')

    // Quoting panel.
    readonly qPanelBestBid = () => this.page.locator('#btnAwardBid')
    readonly qPanelBestOffer = () => this.page.locator('#btnAwardOffer')

    constructor(page: Page) {

        super(page)
        this.page = page

    }

    async archiveAll() { await this.page.goto('/api/bid/archiveallthethingsquickly') }

    async uploads(fileName: string) {

        await this.page.evaluate(async () => {
            return await fetch('https://uat3.otcxtrading.com/api/import/ArchiveStagedEntries')
        });

        const filePath = path.join(__dirname, '../Data/RFQs/' + fileName)
        await this.page.setInputFiles('#irsselectfiletoimport', filePath)

    }

    async importsRfqAs(importType: string) {

        const stagingImportTypeBtn = this.page.getByRole("button").filter({ hasText: importType })

        await this.goToStagingBtn().click()
        await this.selectAllBtn().click()
        await stagingImportTypeBtn.click()

    }

    async loadsShortCode(shortcode: string) {

        await this.shortCodeInput().fill(shortcode)
        await this.goBtn().click()

    }

    async sendsRFQ(options?: { 

        bank2?: string 
        oneWay?: boolean, 
        withDeltaX?: boolean, 
        dxNot?: string, 
        atmFr?: string 

    }) {

        await this.blotterSendBtn().click()

        // Bank 1 is hard coded as it is always selected.
        await this.page.getByRole('button', { name: 'MWMEGA' }).click()

        // Apply options.
        if (options?.bank2 !== undefined) { await this.page.getByRole("button").filter({ hasText: options.bank2 }).click() }
        if (options?.oneWay === true) { await this.oneWay().click() }
        if (options?.withDeltaX === true) { await this.withDeltaExchange().check() }
        if (options?.dxNot !== undefined) { await this.dxNotional().fill(options.dxNot) }
        if (options?.atmFr !== undefined) { await this.atmForwardRate().fill(options.atmFr) }

        await this.SendBtn().click()

        // TODO: Handle this error better so it doesn't show as a fail and doesn't log to console.
        // Handle 'An error occurred' message that sometimes happens possibly due to deadlock.
        let errorVisible = false

        await this.errormsg().waitFor({ state: "visible", timeout: 3000 }).catch(console.log)

        if (await this.errormsg().isVisible()) { errorVisible = true }

        while (errorVisible === true) {
            await this.SendBtn().click()
            await this.errormsg().waitFor({ state: "visible", timeout: 3000 }).catch(console.log)
            if (!await this.errormsg().isVisible()) {
                errorVisible = false
            }
        }
    }

    async awardsBest(quote: string) {

        if (quote === "bid") {
            await this.qPanelBestBid().click()
        } else if (quote === "offer") {
            await this.qPanelBestOffer().click()
        } else {
            console.log("Unrecognised quote value for awardsBest method.")
        }

    }

    async clicksSummaryTab() { await this.summaryTab().click() }

    async clicksAcceptsDetails() { await this.acceptDetailsBtn().click() }
}
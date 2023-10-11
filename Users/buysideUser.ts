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
    private readonly bankBtn: Locator
    private readonly SendBtn: Locator
    private readonly errormsg: Locator

    // Quoting panel.
    private readonly qPanelBestBid: Locator
    private readonly qPanelBestOffer: Locator


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
        this.bankBtn = page.getByRole("button").filter({ hasText: 'MWMEGA' })
        this.SendBtn = page.locator("//button[@id='submitButton']")
        this.errormsg = page.getByText('An error occurred.')

        // Quoting panel
        this.qPanelBestBid = page.locator("//button[@id='btnAwardBid']")
        this.qPanelBestOffer = page.locator("//button[@id='btnAwardOffer']")

    }

    async uploadsRfq(fileName: string) {

        await this.page.evaluate(() => {
            return fetch('https://uat3.otcxtrading.com/api/import/ArchiveStagedEntries'); // Replace with your desired URL
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

    async sendsRFQ() {

        let errorVisible = false

        await this.blotterSendBtn.click()
        await this.bankBtn.click()
        await this.SendBtn.click()

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




}
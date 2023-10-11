import { Locator, Page } from "@playwright/test";
import BasePage from "./baseUser";

export default class SellsideUser extends BasePage {

    readonly page: Page
    private readonly ackBtn: Locator

    // Quoting panel.
    private readonly qPanelBid: Locator;
    private readonly qPanelOffer: Locator;
    private readonly qPanelQuote: Locator;
    private readonly qPanelAllIn: Locator
    private readonly qPanelTrader: Locator;
    private readonly qPanelTraderOption1: Locator;
    private readonly qPanelDone: Locator;

    constructor(page: Page) {

        super(page)
        this.page = page
        this.ackBtn = page.getByRole("button").filter({ hasText: "Acknowledge" })
        this.qPanelBid = page.locator("#inputBidQuote")
        this.qPanelOffer = page.locator("#inputOfferQuote")
        this.qPanelQuote = page.locator("#btnQuoteActionIrs")
        this.qPanelAllIn = page.locator("#allInFieldPackage")
        this.qPanelTrader = page.locator("#traderDropdown")
        this.qPanelTraderOption1 = page.locator("#traders > option:nth-child(1)")
        this.qPanelDone = page.locator("#btnDoneAction")

    }

    async acknowledges() {
        await this.ackBtn.click()
    }

    async clicksDone() {
        await this.qPanelDone.click()
    }

    async quotes(options?: { bid?: string; offer?: string; allIn?: string; }) {


        // Input quoting values.
        if (options?.bid !== undefined) {
            await this.qPanelBid.fill(options.bid)
        }
        if (options?.offer !== undefined) {
            await this.qPanelOffer.fill(options.offer)
        }
        if (options?.allIn !== undefined) {
            await this.qPanelAllIn.fill(options.allIn)
        }


        // Select Trader Name from dropdown.
        const firstTraderName: string | null = await this.qPanelTraderOption1.getAttribute('value')

        if (firstTraderName != null) {
            await this.qPanelTrader.fill(firstTraderName)
        } else {
            console.log('No trader found when quoting.')
        }

        await this.qPanelQuote.click()

    }

}
import { Page } from "@playwright/test";
import BasePage from "./baseUser";

export default class SellsideUser extends BasePage {

    page: Page

    // Blotter actions.
    private readonly ackBtn = () => this.page.getByRole("button").filter({ hasText: "Acknowledge" })

    // Quoting panel.
    private readonly qPanelBid = () => this.page.locator("#inputBidQuote")
    private readonly qPanelOffer = () => this.page.locator("#inputOfferQuote")
    private readonly qPanelQuote = () => this.page.locator("#btnQuoteActionIrs")
    private readonly qPanelAllIn = () => this.page.locator("#allInFieldPackage")
    private readonly qPanelTrader = () => this.page.locator("#traderDropdown")
    private readonly qPanelTraderOption1 = () => this.page.locator("#traders > option:nth-child(1)")
    private readonly qPanelDone = () => this.page.locator("#btnDoneAction")
    private readonly qPanelEnterDetails = () => this.page.locator("#btnEnterDetails")

    // Enter details.
    private readonly enterDetailSubmitBtn = () => this.page.locator('#submitButton')

    constructor(page: Page) {

        super(page)
        this.page = page

    }

    async acknowledges() { await this.ackBtn().click() }

    async clicksDone() { await this.qPanelDone().click() }

    async quotes(options: { bid?: string, offer?: string, allIn?: string; }) {

        // Input quoting values.
        if (options.bid !== undefined) {await this.qPanelBid().fill(options.bid)}
        if (options.offer !== undefined) {await this.qPanelOffer().fill(options.offer)}
        if (options.allIn !== undefined) {await this.qPanelAllIn().fill(options.allIn)}

        // Select Trader Name from dropdown.
        const firstTraderName: string | null = await this.qPanelTraderOption1().getAttribute('value')

        if (firstTraderName != null) {
            await this.qPanelTrader().fill(firstTraderName)
        } else {
            console.log('No trader found when quoting.')
        }

        await this.qPanelQuote().click()

    }

    async entersDetails(options?: { dxDir?: string }) {

        await this.qPanelEnterDetails().click()

        // Choose DX Direction.
        if (options?.dxDir !== undefined) {await this.dmDxDirDropDown().selectOption(options.dxDir)}
   
        await this.enterDetailSubmitBtn().click()

    }

}
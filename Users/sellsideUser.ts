import { Locator, Page } from "@playwright/test";
import BasePage from "./baseUser";
import swap from "../Data/swapTypes.json"

export default class SellsideUser extends BasePage {

    readonly page: Page
    private readonly ackBtn: Locator

    // Quoting panel.
    private readonly qPanelBid: Locator;
    private readonly qPanelOffer: Locator;
    private readonly qPanelQuote: Locator;
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


    async quotes(swapKind: string, bid: string = '1.1', offer: string = '1.2') {

        let firstTraderName: string | null
        
        switch (swapKind) {
            case swap.out:
            case swap.inf:
            case swap.ios:
                await this.qPanelBid.fill(bid)
                await this.qPanelOffer.fill(offer)
                firstTraderName = await this.qPanelTraderOption1.getAttribute("value")
                if(firstTraderName != null){
                    this.qPanelTrader.fill(firstTraderName)
                }
                            
                break;

            default:
                break;
        }

        this.qPanelQuote.click()

    }
}
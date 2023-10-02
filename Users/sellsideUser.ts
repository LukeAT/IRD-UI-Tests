import { Locator, Page } from "@playwright/test";
import BasePage from "./baseUser";
import swap from "../Data/instrument.json"

export default class SellsideUser extends BasePage {

    readonly page: Page
    readonly ackBtn: Locator

    // Quoting panel.
    readonly qPanelBid: Locator;
    readonly qPanelOffer: Locator;
    readonly qPanelQuote: Locator;
    readonly qPanelTrader: Locator;
    readonly qPanelTraderOption: Locator;



    constructor(page: Page) {

        super(page)
        this.page = page
        this.ackBtn = page.getByRole("button").filter({ hasText: "Acknowledge" })
        this.qPanelBid = page.locator("//*[@id='inputBidQuote']")
        this.qPanelOffer = page.locator("//*[@id='inputOfferQuote']")
        this.qPanelQuote = page.locator("//*[@id='btnQuoteActionIrs']")
        this.qPanelTrader = page.locator("//*[@id='traderDropdown']")
        this.qPanelTraderOption = page.getByText("@otcxbiz")



    }

    async acknowledges() {
        this.ackBtn.click()
    }

    async quotes(swapKind: string, bid: string = "1.1", offer: string = "1.2") {


        switch (swapKind) {
            case swap.out:
            case swap.inf:
            case swap.ios:
                this.qPanelBid.fill(bid)
                this.qPanelOffer.fill(offer)
                this.qPanelTrader.fill("a")
                this.qPanelTraderOption.first().click()

                break;

            default:
                break;
        }


        this.qPanelQuote.click()

    }
}
import { test, expect, Page, BrowserContext } from "@playwright/test";
import BuysideUser from "../Users/buysideUser";
import SellsideUser from "../Users/sellsideUser";
import auth from "../Data/signInDetails.json"
import rfqState from "../Data/rfqStates.json"
import sc from "../Data/shortcodes.json"
import i from "../Data/importTypes.json"


test.describe('manual test suite', () => {

    // Use soft assertions.
    const Expect = expect.configure({ soft: true });

    // bs and ss context and page and user.
    let bsContext: BrowserContext
    let ssContext: BrowserContext
    let bsPage: Page
    let ssPage: Page
    let bs: BuysideUser
    let ss: SellsideUser

    test.beforeAll(async ({ browser }) => {

        //Instantiate bs and ss context, page and user.
        bsContext = await browser.newContext()
        ssContext = await browser.newContext()
        bsPage = await bsContext.newPage()
        ssPage = await ssContext.newPage()
        bs = new BuysideUser(bsPage)
        ss = new SellsideUser(ssPage)

        //Sign in to bid.
        await bs.signIn(bsPage, auth.INF.bs.username, auth.INF.bs.password)
        await ss.signIn(ssPage, auth.INF.ss1.username, auth.INF.ss1.password)
        await bsPage.goto('/api/bid/archiveallthethingsquickly')

    })

    test.beforeEach(async () => {

        await ssPage.goto('/')
        await bsPage.goto('/')

    })

    test.afterEach(async () => {

        await bsPage.goto('/api/bid/archiveallthethingsquickly')

    })

    test.afterAll(async () => {

        await bsContext.close()
        await ssContext.close()

    })

    test('MAN Send INF shortcode and verify rfq status after ss acknowledges', async () => {

        await bs.loadsShortCode(sc.INF.EUR)
        await bs.sendsRFQ()
        await ss.acknowledges()
        await ss.quotes({ bid: '1.1', offer: '1.2' })
        await bs.awardsBest("offer")
        await ss.clicksDone()

        bs.clicksSummaryTab()
        await Expect(bs.blotterStatus).toHaveText(rfqState.Affirmed)
        await Expect(bs.mainEconBankSide).toHaveText('Rec fixed')
        await Expect(bs.dealSumWinningQuote).toHaveText('1.2%')
        await Expect(bs.mainEconNotional.first()).toHaveText('100,000,000')

    })

    test(`MAN upload outright TSV and verify rfq status after ss acknowledges`, async () => {

        await bs.uploads('outright.tsv')
        await bs.importsRfqAs(i.rfqOnRate)
        await bs.sendsRFQ()
        await ss.acknowledges()
        await ss.quotes({ bid: '1.1', offer: '1.2' })
        await bs.awardsBest("offer")
        await ss.clicksDone()

        bs.clicksSummaryTab()
        await Expect(bs.blotterStatus).toHaveText(rfqState.Affirmed)
        await Expect(bs.mainEconBankSide).toHaveText('Rec fixed')
        await Expect(bs.dealSumWinningQuote).toHaveText('1.2%')
        await Expect(bs.mainEconNotional.first()).toHaveText('100,000,000')

    })

    test(`MAN upload swaption TSV and verify rfq status after ss acknowledges`, async () => {

        await bs.uploads('swnBuyReceiverSpreadWithDxNot.tsv')
        await bs.importsRfqAs(i.swaption)
        await bs.sendsRFQ({ 
            withDeltaX: true,
            dxNot: '1,000,000', 
            atmFr: '1.33', 
            oneWay: true })
        await ss.acknowledges()
        await ss.quotes({ bid: '21'})
        await bs.awardsBest('bid')
        await ss.clicksDone()
        await ss.entersDetails({ dxDir: 'Receive' })

        await bs.clicksAcceptsDetails()

        // Assert total row of accept details modal.
        await Expect(bs.PremiumDir).toHaveText('Receive')
        await Expect(bs.premiumCents).toHaveText('21')
        await Expect(bs.premiumCash).toHaveText('420,000 USD')
        await Expect(bs.DxDir).toHaveText('Receive')
        await Expect(bs.DxNot).toHaveText('1,000,000')

        await bs.clicksAccept()
        await bs.clicksSummaryTab()

        // Assert details after affirm.
        await Expect(bs.blotterStatus).toHaveText(rfqState.Affirmed)
        await Expect(bs.mainEconBankSide).toHaveText('Buy')
        await Expect(bs.dealSumWinningQuote).toHaveText('21')
        await Expect(bs.mainEconNotional.first()).toHaveText('200,000,000')
        await Expect(bs.qPanelBestBid).toContainText(['21 c', 'MWMEGA', '420,000', 'USD'])

    })

    const shortcodes = [
        sc.INF.EUR,
        sc.OUT.EUR
    ]

    for (let i = 0; i < shortcodes.length; i++) {

        test(`MAN Send shortcodes and verify rfq status after ss acknowledges ${i}`, async () => {

        await bs.loadsShortCode(shortcodes[i])
        await bs.sendsRFQ()
        await ss.acknowledges()
        await ss.quotes({ bid: '1.1', offer: '1.2' })
        await bs.awardsBest("offer")
        await ss.clicksDone()

        bs.clicksSummaryTab()
        await Expect(bs.blotterStatus).toHaveText(rfqState.Affirmed)
        await Expect(bs.sumTabBankSide).toHaveText('Rec fixed')
        await Expect(bs.sumTabWinningQuote).toHaveText('1.2%')
        await Expect(bs.sumTabNotional.first()).toHaveText('50,000,000')
        
        })
    }
})



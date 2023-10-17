import { test, expect, Page, BrowserContext } from "@playwright/test"
import BuysideUser from "../Users/buysideUser"
import SellsideUser from "../Users/sellsideUser"
import auth from "../Data/frameworkData/signInDetails.json"
import sc from "../Data/frameworkData/shortcodes.json"
import i from "../Data/frameworkData/importTypes.json"


test.describe('Verify details for inflation swaps.', () => {

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

        // Instantiate bs and ss context, page and user.
        bsContext = await browser.newContext()
        ssContext = await browser.newContext()
        bsPage = await bsContext.newPage()
        ssPage = await ssContext.newPage()
        bs = new BuysideUser(bsPage)
        ss = new SellsideUser(ssPage)

        // Sign in to bid.
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

    test('INF Send INF shortcode and verify details after affirm.', async () => {

        await bs.loadsShortCode(sc.INF.EUR)
        await bs.sendsRFQ()
        await ss.acknowledges()
        await ss.quotes({ bid: '1.1', offer: '1.2' })
        await bs.awardsBest("offer")
        await ss.clicksDone()
        bs.clicksSummaryTab()

        // Affirm-time assertions.
        await Expect(bs.blotterStatus).toHaveText('Affirmed')
        await Expect(bs.mainEconBankSide).toHaveText('Rec fixed')
        await Expect(bs.winningQuote).toHaveText('1.2%')

    })

    test('INF upload outright TSV and verify details after affirm.', async () => {

        await bs.uploads('outright.tsv')
        await bs.importsRfqAs(i.rfqOnRate)
        await bs.sendsRFQ()
        await ss.acknowledges()
        await ss.quotes({ bid: '1.1', offer: '1.2' })
        await bs.awardsBest("offer")
        await ss.clicksDone()
        bs.clicksSummaryTab()

        // Affirm-time assertions.
        await Expect(bs.blotterStatus).toHaveText('Affirmed')
        await Expect(bs.mainEconBankSide).toHaveText('Rec fixed')
        await Expect(bs.winningQuote).toHaveText('1.2%')

    })

    test(`INF upload swaption and verify enter details, then summary tab after affirm.`, async () => {

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

        // Check Accept details modal values.
        await Expect(bs.dmPremiumDir).toHaveText('Receive')
        await Expect(bs.dmPremiumCents).toHaveText('21 c')
        await Expect(bs.dmPremiumCash).toHaveText('420,000 USD')
        await Expect(bs.dmDxDir).toHaveText('Pay')
        await Expect(bs.dmDxNot).toHaveText('1,000,000')
        
        await bs.clicksAccept()
        await bs.clicksSummaryTab()

        // Check inspector values after Affirm.
        await Expect(bs.blotterStatus).toHaveText('Affirmed')
        await Expect(bs.qPanelBestBid).toContainText('21 c  - MWMEGA420,000 USD')
        await Expect(bs.winningQuote).toHaveText('21 c')
        await Expect(bs.mainEconBankSide).toHaveText('Buy')
        
    })

    const shortcodes = [
        sc.INF.EUR,
        sc.OUT.EUR
    ]

    for (let i = 0; i < shortcodes.length; i++) {

        test(`INF Send shortcodes and verify details after affirm. ${i}`, async () => {

        await bs.loadsShortCode(shortcodes[i])
        await bs.sendsRFQ()
        await ss.acknowledges()
        await ss.quotes({ bid: '1.1', offer: '1.2' })
        await bs.awardsBest("offer")
        await ss.clicksDone()
        bs.clicksSummaryTab()

        // Affirm-time assertions.
        await Expect(bs.blotterStatus).toHaveText('Affirmed')
        await Expect(bs.mainEconBankSide).toHaveText('Rec fixed')
        await Expect(bs.winningQuote).toHaveText('1.2%')

        })
    }
})



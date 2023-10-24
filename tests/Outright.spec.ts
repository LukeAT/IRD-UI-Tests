import { test, expect } from "@playwright/test"
import BuysideUser from "../Users/buysideUser"
import SellsideUser from "../Users/sellsideUser"
import auth from "../Data/frameworkData/signInDetails.json"
import sc from "../Data/frameworkData/shortcodes.json"
import i from "../Data/frameworkData/importTypes.json"
import Utils from "../Helpers/Utils"


test.describe('Verify details for outright swaps', async () => {

    // Use soft assertions.
    const Expect = expect.configure({ soft: true });

    let bs: BuysideUser
    let ss: SellsideUser

    test.beforeAll(async ({ browser }) => {

        // Create users
        bs = new BuysideUser(await browser.newPage())
        ss = new SellsideUser(await browser.newPage())

        await bs.signIn(auth.OUT.bs.username, auth.OUT.bs.password)
        await ss.signIn(auth.OUT.ss1.username, auth.OUT.ss1.password)
        await bs.archiveAll()

    })

    test.beforeEach(async () => {

        await ss.goHome()
        await bs.goHome()

    })

    test.afterEach(async () => {

        await bs.archiveAll()

    })

    test.afterAll(async () => {
        // I think we don't need to close the browser because it's a fixture and playwright handles that?
        await bs.page.close()
        await ss.page.close()

    })

    test('OUT Send INF shortcode and verify details after affirm.', async () => {

        await bs.loadsShortCode(sc.INF.EUR)
        await bs.sendsRFQ()
        await ss.acknowledges()
        await ss.quotes({ bid: '1.1', offer: '1.2' })
        await bs.awardsBest("offer")
        await ss.clicksDone()
        await bs.clicksSummaryTab()

        // Check inspector values after Affirm.
        await Expect(bs.blotterStatus()).toHaveText('Affirmed')
        await Expect(bs.mainEconBankSide()).toHaveText('Rec fixed')
        await Expect(bs.winningQuote()).toHaveText('1.2%')

    })

    test('OUT upload outright TSV and verify details after affirm.', async () => {

        await bs.uploads('outright.tsv')
        await bs.importsRfqAs(i.rfqOnRate)
        await bs.sendsRFQ()
        await ss.acknowledges()
        await ss.quotes({ bid: '1.1', offer: '1.2' })
        await bs.awardsBest("offer")
        await ss.clicksDone()
        await bs.clicksSummaryTab()

        // Check inspector values after Affirm.
        await Expect(bs.blotterStatus()).toHaveText('Affirmed')
        await Expect(bs.mainEconBankSide()).toHaveText('Rec fixed')
        await Expect(bs.winningQuote()).toHaveText('1.2%')

    })

    test(`OUT upload swaption and verify enter details, then summary tab after affirm.`, async () => {

        await bs.uploads('swnBuyReceiverSpreadWithDxNot.tsv')
        await bs.importsRfqAs(i.swaption)
        await bs.sendsRFQ({
            withDeltaX: true,
            dxNot: '1,000,000',
            atmFr: '1.33',
            oneWay: true
        })
        await ss.acknowledges()
        await ss.quotes({ bid: '21' })
        await bs.awardsBest('bid')
        await ss.clicksDone()
        await ss.entersDetails({ dxDir: 'Receive' })
        await bs.clicksAcceptsDetails()

        // Check Accept details modal values.
        await Expect(bs.dmPremiumDir()).toHaveText('Receive')
        await Expect(bs.dmPremiumCents()).toHaveText('21 c')
        await Expect(bs.dmPremiumCash()).toHaveText('420,000 USD')
        await Expect(bs.dmDxDir()).toHaveText('Pay')
        await Expect(bs.dmDxNot()).toHaveText('1,000,000')

        await bs.clicksAccept()
        await bs.clicksSummaryTab()

        // Check inspector values after Affirm.
        await Expect(bs.blotterStatus()).toHaveText('Affirmed')
        await Expect(bs.qPanelBestBid()).toContainText('21 c  - MWMEGA420,000 USD')
        await Expect(bs.winningQuote()).toHaveText('21 c')
        await Expect(bs.mainEconBankSide()).toHaveText('Buy')

    })

    const shortcodes = [
        sc.INF.EUR,
        sc.OUT.EUR
    ]

    for (let i = 0; i < shortcodes.length; i++) {

        test(`OUT Send shortcodes and verify details after affirm. ${i}`, async () => {

            await bs.loadsShortCode(shortcodes[i])
            await bs.sendsRFQ()
            await ss.acknowledges()
            await ss.quotes({ bid: '1.1', offer: '1.2' })
            await bs.awardsBest("offer")
            await ss.clicksDone()
            await bs.clicksSummaryTab()

            // Check inspector values after Affirm.
            await Expect(bs.blotterStatus()).toHaveText('Affirmed')
            await Expect(bs.mainEconBankSide()).toHaveText('Rec fixed')
            await Expect(bs.winningQuote()).toHaveText('1.2%')

        })
    }


    const params = Utils.csvParameters('outrightScRfqs.csv')

    for (const p of params) {

        test(`OUT Send CSV params and verify details after affirm. ${p.key}`, async () => {

            await bs.loadsShortCode(p.shortcodes)
            await bs.sendsRFQ()
            await ss.acknowledges()
            await ss.quotes({ bid: p.bid, offer: p.offer })
            await bs.awardsBest("offer")
            await ss.clicksDone()
            await bs.clicksSummaryTab()

            // Check inspector values after Affirm.
            await Expect(bs.blotterStatus()).toHaveText('Affirmed')
            await Expect(bs.mainEconBankSide()).toHaveText('Rec fixed')
            await Expect(bs.winningQuote()).toHaveText(p.winningQuote)

        })

    }

    const params1 = Utils.csvParameters('outrightTsvRfqs.csv')

    for (const p of params1) {

        test(`XYZ Send CSV params and verify details after affirm. ${p.key}`, async () => {

            await bs.uploads(p.rfqFile)
            await bs.importsRfqAs(i.rfqOnRate)
            await bs.sendsRFQ()
            await ss.acknowledges()
            await ss.quotes({ bid: p.bid, offer: p.offer })
            await bs.awardsBest("offer")
            await ss.clicksDone()
            await bs.clicksSummaryTab()

            // Check inspector values after Affirm.
            await Expect(bs.blotterStatus()).toHaveText('Affirmed')
            await Expect(bs.mainEconBankSide()).toHaveText('Rec fixed')
            await Expect(bs.winningQuote()).toHaveText(p.winningQuote)

        })

    }

    const params2 = [
        ['p eur 5y not 100mm', '1.1', '1.2', '1.2%'],
        ['p gbp 5y not 50mm inf', '1.3', '1.4', '1.4%'],
        ['p huf 2y not 1b ois', '1.4', '1.5, 1.5%']
    ]

    for (let i = 0; i < params2.length; i++) {

        test(`WXYZ Send CSV params and verify details after affirm. ${i}`, async () => {

            await bs.loadsShortCode(params2[i][0])
            await bs.sendsRFQ()
            await ss.acknowledges()
            await ss.quotes({ bid:params2[i][1], offer: params2[i][2] })
            await bs.awardsBest("offer")
            await ss.clicksDone()
            await bs.clicksSummaryTab()

            // Check inspector values after Affirm.
            await Expect(bs.blotterStatus()).toHaveText('Affirmed')
            await Expect(bs.mainEconBankSide()).toHaveText('Rec fixed')
            await Expect(bs.winningQuote()).toHaveText(params2[i][3])

        })

    }

    const a = [
        {shortCode: 'p eur 5y not 100mm', bid: '1.1', offer: '1.2', winningQuote: '1.2%'},
        {shortCode: 'p gbp 5y not 50mm inf', bid: '1.3', offer: '1.4', winningQuote: '1.4%'},
        {shortCode: 'p huf 2y not 1b ois', bid: '1.4', offer: '1.5', winningQuote: '1.5%'},
    ]

    for (let i = 0; i < params2.length; i++) {

        test(`WXYZQ Send CSV params and verify details after affirm. ${i}`, async () => {

            await bs.loadsShortCode(a[i].shortCode)
            await bs.sendsRFQ()
            await ss.acknowledges()
            await ss.quotes({ bid:a[i].bid, offer: a[i].offer })
            await bs.awardsBest("offer")
            await ss.clicksDone()
            await bs.clicksSummaryTab()

            // Check inspector values after Affirm.
            await Expect(bs.blotterStatus()).toHaveText('Affirmed')
            await Expect(bs.mainEconBankSide()).toHaveText('Rec fixed')
            await Expect(bs.winningQuote()).toHaveText(a[i].winningQuote)

        })

    }


})
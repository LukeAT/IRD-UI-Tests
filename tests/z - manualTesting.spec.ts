import { test, expect, Page, BrowserContext } from "@playwright/test";
import BuysideUser from "../Users/buysideUser";
import SellsideUser from "../Users/sellsideUser";
import auth from "../Data/signInDetails.json"
import rfqState from "../Data/rfqStates.json"
import sc from "../Data/shortcodes.json"
import swapType from "../Data/swapTypes.json"
import impType from "../Data/importTypes.json"


test.describe('Inflation test suite', () => {

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

    test('Send INF shortcode and verify rfq status after ss acknowledges', async () => {

        await bs.loadsShortCode(sc.INF.EUR)
        await bs.sendsRFQ()
        await ss.acknowledges()
        await ss.quotes(swapType.inf)
        await bs.awardsBest("offer")
        await ss.clicksDone()

        await Expect(bs.blotterStatus).toHaveText(rfqState.Affirmed)

    })

    test(`upload outright TSV and verify rfq status after ss acknowledges`, async () => {

        await bs.uploadsRfq('outright.tsv')
        await bs.importsRfqAs(impType.rfqOnRate)
        await bs.sendsRFQ()
        await ss.acknowledges()
        await ss.quotes(swapType.out)
        await bs.awardsBest("offer")
        await ss.clicksDone()

        await Expect(bs.blotterStatus).toHaveText(rfqState.Affirmed)

    })

    const shortcodes = [
        sc.INF.EUR,
        sc.OUT.EUR
    ]

    for (let i = 0; i < shortcodes.length; i++) {

        test(`Send shortcodes and verify rfq status after ss acknowledges ${i}`, async () => {

        await bs.loadsShortCode(shortcodes[i])
        await bs.sendsRFQ()
        await ss.acknowledges()
        await ss.quotes(swapType.inf)
        await bs.awardsBest("offer")
        await ss.clicksDone()

        await Expect(bs.blotterStatus).toHaveText(rfqState.Affirmed)
        
        })
    }
})
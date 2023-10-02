import { test, expect, Page, BrowserContext } from "@playwright/test";
import BuysideUser from "../Users/buysideUser";
import SellsideUser from "../Users/sellsideUser";
import auth from "../Data/signInDetails.json"
import rfqState from "../Data/rfqStates.json"
import sc from "../Data/shortcodes.json"
import swap from "../Data/instrument.json"


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

    test(`FIRST send INF shortcode and verify rfq status after ss acknowledges`, async () => {

        await bs.sendsShortCode(sc.inf.EUR)
        await ss.acknowledges()
        await ss.quotes(swap.inf)
        await bs.awardsBest("offer")

        await Expect(bs.blotterStatus).toHaveText(rfqState.acknowledged)

    })


    const shortcodes = [
        sc.inf.EUR,
        sc.outright.EUR,
        sc.basis.closeRec
    ]

    for (let i = 0; i < shortcodes.length; i++) {

        test(`Send shortcodes and verify rfq status after ss acknowledges ${i}`, async () => {

            await bs.sendsShortCode(shortcodes[i])
            await ss.acknowledges()
            await ss.quotes(swap.inf)
            await bs.awardsBest("offer")

            await Expect(bs.blotterStatus).toHaveText(rfqState.acknowledged)
        }
    }


})
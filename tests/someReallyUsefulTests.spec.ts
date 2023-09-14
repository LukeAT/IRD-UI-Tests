import { BrowserContext, Page, test, expect } from "@playwright/test"
import SignIn from "../Components/signin"
import BasePage from "../Components/basePage"
import auth from "../Data/signInDetails.json"
import sc from "../Data/shortcodes.json"

test.describe('some really useful tests', () => {

    //Use soft assertions.
    const sExpect = expect.configure({ soft: true });

    //Buyside browser context and pages.
    let bsContext: BrowserContext
    let bsPage: Page
    let bsSignInPage: SignIn
    let bsBasePage: BasePage

    //Sellside browser context and pages.
    let ssContext: BrowserContext
    let ssPage: Page
    let ssSignInPage: SignIn
    let ssBasePage: BasePage

    test.beforeAll(async ({ browser }) => {

        //Instantiate buyside browser-context, context-page and page-objects.
        bsContext = await browser.newContext()
        bsPage = await bsContext.newPage()
        bsSignInPage = new SignIn(bsPage)
        bsBasePage = new BasePage(bsPage)

        //Instantiate sellside browser-context, context-page and page-objects.
        ssContext = await browser.newContext()
        ssPage = await ssContext.newPage()
        ssSignInPage = new SignIn(ssPage)
        ssBasePage = new BasePage(ssPage)

        //Sign in to bid.
        bsSignInPage.signIn(bsPage, auth.outright.BSUsr.userOne.username, auth.outright.BSUsr.userOne.password)
        ssSignInPage.signIn(ssPage, auth.outright.SSUsr.userOne.username, auth.outright.SSUsr.userOne.password)
    })

    test.beforeEach(async () => {
        await bsPage.goto('/api/bid/archiveallthethingsquickly')
        await bsPage.goto('/')
    })

    test.afterAll(async () => {
        await bsContext.close()
        await ssContext.close()
        // Do i need to close the context too?
    })



})
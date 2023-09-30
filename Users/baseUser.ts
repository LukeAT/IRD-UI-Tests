import { Page, Locator } from "@playwright/test";

export default class BaseUser {

    readonly page: Page

    

    // Sign-in.
    readonly signInEmail: Locator
    readonly signInPwd: Locator
    readonly logInBtn: Locator
    readonly enablePopUp: Locator
    readonly remindMePopUp: Locator

    readonly blotterStatus: Locator

    constructor(page: Page) {

        this.page = page
        this.signInEmail = page.locator('#Email')
        this.signInPwd = page.locator('#Password')
        this.logInBtn = page.getByRole('button').filter({ hasText: 'Log In' })
        this.enablePopUp = page.getByRole('button').filter({ hasText: 'Enable' })
        this.remindMePopUp = page.getByRole('button').filter({ hasText: 'Remind Me in 14 days.' })
        this.blotterStatus = page.locator("//div[@id='statusIdCell']").first()

    }


    async signIn(page: Page, username: string, password: string) {

        // Uses base URL in plawyright.config.
        page.goto('/')

        // Sign-in modal.
        await this.signInEmail.fill(username)
        await this.signInPwd.fill(password)
        await this.logInBtn.click()

        // Get through first time sign in pop-ups.
        await this.enablePopUp.click()
        await this.remindMePopUp.click()

    }
}
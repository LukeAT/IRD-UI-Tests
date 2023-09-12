import { Locator, Page } from "@playwright/test"
import * as fs from 'fs';


class SignIn {

    private readonly page: Page
    readonly emailField: Locator
    readonly pwdField: Locator
    readonly logInBtn: Locator
    readonly enablePopUp: Locator
    readonly remindMePopUp: Locator

    constructor(page: Page) {

        this.page = page
        this.emailField = page.locator('#Email')
        this.pwdField = page.locator('#Password')
        this.logInBtn = page.getByRole('button').filter({ hasText: 'Log In' })
        this.enablePopUp = page.getByRole('button').filter({ hasText: 'Enable' })
        this.remindMePopUp = page.getByRole('button').filter({ hasText: 'Remind Me in 14 days.' })

    }

    async signIn(page: Page, username: string, password: string) {

          //uses base URL in plawyright.config.
        page.goto('/')

        // Sign-in modal.
        await this.emailField.fill(username)
        await this.pwdField.fill(password)
        await this.logInBtn.click()

        // Get through first time sign in pop-ups.
        await this.enablePopUp.click()
        await this.remindMePopUp.click()
    }
}

export default SignIn
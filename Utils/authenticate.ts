import { Page } from "@playwright/test"

 class Authenticate {
    
    userNames = {
        BuySideOutrightUsername: "lukebs1@u1.d1",
        BuySideOISUsername: "BuySideOISUsername@bs.bs", 

    }

    passwords = {
        BuySideOutrightPassword: "bs",
        BuySideOISPassword: "BuySideOISPassword",
    }
    

    async signIn (page: Page, username: string, password: string ) {
        
        //uses the base URL in the plawyright.config.
        page.goto('/')

        // Sign-in.
        await page.locator('#Email').fill(username)
        await page.locator('#Password').fill(password)
        await page.getByRole('button').filter({ hasText: 'Log In' }).click()

        // Get through first time sign in pop-ups.
        await page.getByRole('button').filter({ hasText: 'Enable' }).click()
        await page.getByRole('button').filter({ hasText: 'Remind Me in 14 days.' }).click()
    }
}

export default Authenticate
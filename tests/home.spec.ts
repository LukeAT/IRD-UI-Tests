import { test, expect } from "@playwright/test";
import Blotter from "../Components/blotter";




test.describe('Home', () => {



    test('Verify IRS tab', async ({ page }) => {
        
        let p = new Blotter(page)
        
        // Navigate to homepage.
        await p.goToHomePage()

        // Sign-in.
        await page.locator('#Email').fill('Lukebs1@u1.d1')
        await page.locator('#Password').fill('bs')
        await page.getByRole('button').filter({ hasText: 'Log In' }).click()

        // Get through first time sign in pop-ups.
        await page.getByRole('button').filter( { hasText: 'Enable' } ).click()
        await page.getByRole('button').filter( { hasText: 'Remind Me in 14 days.' } ).click()

        //Navigate to 
        await p.irsTab.click()
        await p.shortCodeInput.fill('p usd 5y not 44mm')
        await p.goButton.click()
    })
})

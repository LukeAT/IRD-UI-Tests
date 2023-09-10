import { test, expect } from "@playwright/test";

test.describe('', () => {
    test('Archive x tickets on host app', async ({ page }) => {
        
        page.goto('https://markitwire.otcx.info/tickets')

        const archiveButton = page.locator('//*[@id="root"]/div/div[1]/div/div[3]/button[2]')

        const removeItems: number = 50

        let i = 0, len = removeItems;
        while (i < len) {
            await archiveButton?.click()
            i++
        }

        expect('1').toEqual('1')

    })
    
})

const puppeteer = require('puppeteer')
const axios = require('axios')
require('dotenv').config()

async function snr() {
    try {
        // Open browser
        const browser = await puppeteer.launch()

        // Open new tab
        const page = await browser.newPage()

        // Go to login page of the router
        await page.goto('http://192.168.1.1/Main_Login.asp')

        // Fill in the login form
        await page.type('#login_username', `${process.env.USER_NAME}`);
        await page.type('[type="password"]', `${process.env.PASSWORD}`)

        // Click login button
        await page.click('[onclick="login();"]')

        // Wait for page navigation
        await page.waitForNavigation()

        // Get coockies
        const coockies = await page.cookies()

        // Close browser
        await browser.close();

        // Send http req every 500ms to get DLS info
        setInterval(async () => {
            try {
                // Send http req to router with the cookie we have
                const res = await axios("http://192.168.1.1/cgi-bin/ajax_AdslStatus.asp", {
                    headers: {
                        Cookie: `asus_token=${coockies[0].value};`
                    }
                })

                // Find the downstream SNR value
                const start = res.data.indexOf('log_SNRMarginDown=') + 19
                const end = res.data.indexOf(";", (start + 1)) - 4

                // Console log downstream SNR value
                console.log(`${res.data.substring(start, end)}`)
            } catch (err) {
                console.log(err.message)
            }
        }, 500)

    } catch (err) {
        console.log(err.message)
    }
}

snr()
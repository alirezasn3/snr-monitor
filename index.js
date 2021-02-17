const puppeteer = require('puppeteer')
const axios = require('axios')
const dotenv = require('dotenv').config()

async function getSNR() {

    const browser = await puppeteer.launch({
        headless: true
    })

    const page = await browser.newPage()

    await page.goto('http://192.168.1.1/Main_Login.asp')

    await page.type('#login_username', `${process.env.USER_NAME}`);
    await page.type('[type="password"]', `${process.env.PASSWORD}`)

    await page.click('[onclick="login();"]')

    await page.waitForNavigation()

    const cookies = await page.cookies()

    await browser.close();

    setInterval(async () => {

        const res = await axios("http://192.168.1.1/cgi-bin/ajax_AdslStatus.asp", {
            headers: {
                Cookie: `asus_token=${cookies[0].value};`
            }
        })

        const start = res.data.indexOf('log_SNRMarginDown=') + 19
        const end = res.data.indexOf(";", (start + 1)) - 4

        console.log(`${res.data.substring(start, end)}`)

    }, 1000);

}

getSNR()
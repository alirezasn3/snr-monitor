const puppeteer = require('puppeteer')

var axios = require('axios')

async function getSnr() {

    const browser = await puppeteer.launch({
        headless: true
    })

    const page = await browser.newPage()

    await page.goto('http://192.168.1.1/Main_Login.asp')

    await page.type('#login_username', 'admin');
    await page.type('[type="password"]', '4112345')

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

getSnr()
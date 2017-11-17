const schedule = require('node-schedule')
const puppeteer = require('puppeteer')
const fetch = require('node-fetch')

async function getRates () {
  try {
    console.log('start fetching rates!!')
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
    // const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    // Remitly
    await page.goto('https://www.remitly.com/us/en/india/pricing')
    const remitlyRate = await page.$eval(
      '#indiatable > tbody > tr.forexrates > td:nth-child(1)',
      el => el.innerText
    )
    console.log(`REMITLY --> ${remitlyRate}`)

    // WESTERN UNION
    await page.goto('https://www.westernunion.com/us/en/send-money/app/start')
    await page.waitFor(3000)
    await page.focus('#country')
    await page.type('#country', 'India', { delay: 100 })
    await page.keyboard.press('Enter')
    await page.waitFor(3000)
    const wuRate = await page.$eval('#smoExchangeRate', el => el.innerText)
    console.log(`WESTERN UNION --> ${wuRate}`)

    // XOOM Service
    await page.goto('https://www.xoom.com/india/fees-fx')
    await page.focus('#sendAmount')
    await page.type('#sendAmount', '2500', { delay: 100 })
    await page.waitFor(3000)
    const xoomRate = await page.$eval('#js-ui-content-update-animation-item-1 > p', el => el.innerText)
    console.log(`XOOM --> ${xoomRate}`)

    // RIA Service
    await page.goto('https://www.riamoneytransfer.com/price-calculator')
    await page.waitFor(3000)
    await page.select('select#countriesDDL', 'IN') // single selection
    await page.waitFor(3000)
    const riaRate = await page.$eval(
        '#exchangeRate',
        el => el.innerText
    )
    console.log(`RIA --> ${riaRate}`)
    fetch(process.env.EMAIL_API_ENDPOINT, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'toEmail': 'ranjith2112@gmail.com',
        'subject': 'Transfer Rates',
        'text': `
                 Remitly Rate ---> ${remitlyRate}
                 Western Union Rate ---> ${wuRate}
                 Xoom Rate ---> ${xoomRate}
                 Ria Rate ---> ${riaRate}`
      })
    })
    await browser.close()
  } catch (e) {
    console.log(e)
  }
}

const run = async () => {
  try {
    console.log('started running')
    // getRates()
    // schedule.scheduleJob('*/2 * * * *', getRates)
    schedule.scheduleJob({hour: 21, minute: 30}, getRates)
  } catch (error) {
    console.log(error)
  }
}
run()

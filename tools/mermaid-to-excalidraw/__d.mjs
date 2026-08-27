import { chromium } from 'playwright'
const b = await chromium.launch(); const p = await b.newPage()
await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
await p.locator('.item',{hasText:'Lazy Initial State'}).first().click(); await p.waitForTimeout(400)
console.log(await p.locator('.preview-pane').innerText())

/**
 * End-to-end browser test for realtime messaging.
 *
 * Drives 2 isolated Chromium contexts (an + binh), logs each in, opens
 * /messages, has an send a message, and asserts that:
 *   - the message appears in an's own UI (own-echo via socket)
 *   - the message appears in binh's UI within 2s (peer realtime delivery)
 * Captures screenshots before and after into e2e/screenshots/ for evidence.
 *
 * Run with:  cd twitter-clone-fe && node e2e/messaging.test.mjs
 * Requires:  FE running on :3000, BE running on :9990, `npm run seed` done.
 */

import { chromium } from 'playwright'
import fs from 'node:fs/promises'
import path from 'node:path'

const FE = 'http://localhost:3000'
const SCREEN_DIR = path.join(process.cwd(), 'e2e', 'screenshots')

const green = (s) => `\x1b[32m${s}\x1b[0m`
const red = (s) => `\x1b[31m${s}\x1b[0m`
const dim = (s) => `\x1b[2m${s}\x1b[0m`

let pass = 0
let fail = 0
async function step(label, fn) {
  process.stdout.write(`  ${dim('•')} ${label} `)
  try {
    await fn()
    process.stdout.write(`${green('PASS')}\n`)
    pass++
  } catch (err) {
    process.stdout.write(`${red('FAIL')}\n        ${dim(err.message || err)}\n`)
    fail++
  }
}

async function login(page, email) {
  await page.goto(`${FE}/login`, { waitUntil: 'networkidle' })
  await page.fill('input#email', email)
  await page.fill('input#password', 'Password@123')
  await page.click('button[type="submit"]')
  // wait for redirect to /home or /admin
  await page.waitForURL(/\/(home|admin)/, { timeout: 8000 })
}

async function openMessages(page) {
  await page.goto(`${FE}/messages`, { waitUntil: 'networkidle' })
}

async function selectConversation(page, peerUsername) {
  // ConversationList items expose @username in the second line
  const item = page.locator('button', { hasText: `@${peerUsername}` }).first()
  await item.waitFor({ state: 'visible', timeout: 5000 })
  await item.click()
}

async function sendMessage(page, content) {
  const textarea = page.locator('textarea[aria-label="Nội dung tin nhắn"]')
  await textarea.fill(content)
  await page.locator('button[aria-label="Gửi"]').click()
}

async function expectMessage(page, content, ms = 3000) {
  // Messages appear inside role="log" container
  await page.locator(`text="${content}"`).waitFor({ state: 'visible', timeout: ms })
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(SCREEN_DIR, `${name}.png`), fullPage: false })
}

async function main() {
  await fs.mkdir(SCREEN_DIR, { recursive: true })
  console.log(`\nE2E messaging test → ${FE}\n`)

  const browser = await chromium.launch({ headless: true })
  const anCtx = await browser.newContext()
  const binhCtx = await browser.newContext()
  const an = await anCtx.newPage()
  const binh = await binhCtx.newPage()

  // capture FE console for debug
  an.on('console', (m) => { if (m.type() === 'error') console.log(dim(`  [an console error] ${m.text()}`)) })
  binh.on('console', (m) => { if (m.type() === 'error') console.log(dim(`  [binh console error] ${m.text()}`)) })

  try {
    await step('an logs in', () => login(an, 'an@example.com'))
    await step('binh logs in', () => login(binh, 'binh@example.com'))

    await step('an opens /messages', () => openMessages(an))
    await step('binh opens /messages', () => openMessages(binh))
    await shot(an, '01-an-messages')
    await shot(binh, '01-binh-messages')

    await step('an selects conv with binh_designer', () =>
      selectConversation(an, 'binh_designer'),
    )
    await step('binh selects conv with an_dev', () =>
      selectConversation(binh, 'an_dev'),
    )

    const probe = `__realtime probe ${Date.now()}__`
    await step(`an sends "${probe}"`, async () => {
      await sendMessage(an, probe)
      await expectMessage(an, probe, 3000) // own echo
    })
    await shot(an, '02-an-sent')

    await step('binh receives realtime within 3s', () => expectMessage(binh, probe, 3000))
    await shot(binh, '02-binh-received')

    // Reverse direction too
    const reply = `__realtime reply ${Date.now()}__`
    await step(`binh replies "${reply}"`, async () => {
      await sendMessage(binh, reply)
      await expectMessage(binh, reply, 3000)
    })
    await step('an receives binh reply within 3s', () => expectMessage(an, reply, 3000))
    await shot(an, '03-an-after-reply')
  } finally {
    await browser.close()
  }

  console.log('')
  console.log(`Summary: ${green(String(pass))} pass · ${fail > 0 ? red(String(fail)) : '0'} fail`)
  console.log(`Screenshots: ${SCREEN_DIR}`)
  process.exit(fail > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error('crashed:', err)
  process.exit(1)
})

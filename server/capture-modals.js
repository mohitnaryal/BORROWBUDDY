const puppeteer = require('puppeteer-core');
const path = require('path');
const mongoose = require('mongoose');

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const SCREENSHOTS_DIR = 'C:/Users/Mohit/.gemini/antigravity/scratch/BorrowBuddy/BorrowBuddy_Report/Project_Screenshots';

async function captureRemaining() {
  await mongoose.connect('mongodb://127.0.0.1:27017/borrowbuddy');
  const Item = mongoose.model('Item', new mongoose.Schema({}, { strict: false }));
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

  const items = await Item.find().limit(5);
  const users = await User.find().limit(3);

  const nonAaravItem = items.find(it => it.owner && it.owner.toString() !== users[0]._id.toString()) || items[1];
  const testUserId = users[0]._id.toString();
  const testItemId = nonAaravItem._id.toString();

  await mongoose.disconnect();

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--window-size=1280,900'],
    defaultViewport: { width: 1280, height: 900 },
  });

  const page = await browser.newPage();

  try {
    // 1. Log in as Aarav
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    const demoButtons = await page.$$('button[type="button"]');
    for (const btn of demoButtons) {
      const text = await page.evaluate((el) => el.innerText, btn);
      if (text.includes('Aarav Sharma')) {
        await btn.click();
        break;
      }
    }
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1000));

    // 2. Open non-owned item details
    console.log(`Opening item details: ${testItemId}...`);
    await page.goto(`http://localhost:5173/items/${testItemId}`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    // Click Passport
    console.log('Capturing Passport Modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const pBtn = btns.find(b => b.innerText.includes('Inspect Item Passport'));
      if (pBtn) pBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12_Borrowing_Passport_Modal.png') });

    // Close Passport modal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const cBtn = btns.find(b => b.innerText.includes('Close Passport'));
      if (cBtn) cBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click Request to Borrow
    console.log('Capturing Request Modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const rBtn = btns.find(b => b.innerText.includes('Request to Borrow'));
      if (rBtn) rBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13_Borrow_Request_Modal.png') });

    // 3. User Public Profile
    console.log(`Capturing Public Profile for user ${testUserId}...`);
    await page.goto(`http://localhost:5173/users/${testUserId}`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '14_User_Public_Profile.png') });

    console.log('🎉 All remaining screenshots captured successfully!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
}

captureRemaining();

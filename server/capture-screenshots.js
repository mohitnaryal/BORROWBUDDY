const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = 'C:\\Users\Mohit\\.gemini\\antigravity\\scratch\\BorrowBuddy\\BorrowBuddy_Report\\Project_Screenshots';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function captureAll() {
  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
    defaultViewport: { width: 1280, height: 900 },
  });

  const page = await browser.newPage();

  try {
    // 1. Landing Page
    console.log('1. Capturing Landing Page...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_Landing_Page.png'), fullPage: false });

    // 2. Explore Page
    console.log('2. Capturing Explore Page...');
    await page.goto('http://localhost:5173/explore', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_Explore_Page.png'), fullPage: false });

    // 3. Login Page
    console.log('3. Capturing Login Page...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_Login_Page.png'), fullPage: false });

    // 4. Register Page
    console.log('4. Capturing Register Page...');
    await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_Register_Page.png'), fullPage: false });

    // Log in as Aarav using 1-click button or API token
    console.log('Authenticating as Aarav Sharma...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    // Click the first demo user button (Aarav Sharma)
    const demoButtons = await page.$$('button[type="button"]');
    for (const btn of demoButtons) {
      const text = await page.evaluate((el) => el.innerText, btn);
      if (text.includes('Aarav Sharma')) {
        await btn.click();
        break;
      }
    }
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1500));

    // 5. User Dashboard - Overview
    console.log('5. Capturing User Dashboard Overview...');
    await page.goto('http://localhost:5173/dashboard?tab=overview', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_Dashboard_Overview.png'), fullPage: false });

    // 6. Dashboard - My Listed Items
    console.log('6. Capturing Dashboard My Items...');
    await page.goto('http://localhost:5173/dashboard?tab=items', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_Dashboard_My_Items.png'), fullPage: false });

    // 7. Dashboard - Sent Requests
    console.log('7. Capturing Dashboard Sent Requests...');
    await page.goto('http://localhost:5173/dashboard?tab=sent', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_Dashboard_Sent_Requests.png'), fullPage: false });

    // 8. Dashboard - Received Requests
    console.log('8. Capturing Dashboard Received Requests...');
    await page.goto('http://localhost:5173/dashboard?tab=received', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_Dashboard_Received_Requests.png'), fullPage: false });

    // 9. Dashboard - Transactions & History
    console.log('9. Capturing Dashboard Transactions...');
    await page.goto('http://localhost:5173/dashboard?tab=transactions', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_Dashboard_Transactions.png'), fullPage: false });

    // 10. Add Item Page
    console.log('10. Capturing Add Item Page...');
    await page.goto('http://localhost:5173/items/add', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_Add_Item_Page.png'), fullPage: false });

    // Get an item ID from Explore
    console.log('Finding item for details & modal screenshots...');
    await page.goto('http://localhost:5173/explore', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));
    const detailsLink = await page.$('a[href^="/items/"]');
    if (detailsLink) {
      await detailsLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
      await new Promise((r) => setTimeout(r, 1000));

      // 11. Item Details Page
      console.log('11. Capturing Item Details Page...');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_Item_Details_Page.png'), fullPage: false });

      // 12. Borrowing Passport Modal
      console.log('12. Capturing Borrowing Passport Modal...');
      const passportBtn = await page.$('button::-p-text(Inspect Item Passport)');
      if (passportBtn) {
        await passportBtn.click();
        await new Promise((r) => setTimeout(r, 1200));
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12_Borrowing_Passport_Modal.png'), fullPage: false });
        // Close modal
        const closeBtn = await page.$('button::-p-text(Close Passport)');
        if (closeBtn) await closeBtn.click();
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    console.log('🎉 ALL APPLICATION SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('Error capturing screenshots:', err);
  } finally {
    await browser.close();
  }
}

captureAll();

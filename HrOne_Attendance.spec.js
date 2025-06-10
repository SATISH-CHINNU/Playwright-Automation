const { test, expect } = require('@playwright/test');


const loginUser = {
  email: "",
  password: "",
};


const onDutyReason = "Work From Home";
const comments = "WFH";


async function getDates(locator) {
  const dates = [];
  const count = await locator.count();
  for (let i = 0; i < count; i++) {
    const date = await locator.nth(i).textContent();
    dates.push(date.trim());
  }
  return dates;
}

async function clickAllVisible(locator, page, delay = 300) {
 
  while (await locator.first().isVisible()) {
    await locator.first().click();
    await page.waitForTimeout(delay);
  }
}

test.only('HrOne_portal', async ({ page }) => {
  //  Locators 
  const NestAndLogin = page.locator('.ladda-label:visible');
  const iframe1 = page.frameLocator('iframe#_blitz-frame');
  const dialogPopup = page.locator(".dialogContentInner");
  const userName = page.locator("//div[contains(@class, 'message-container')]//h2//strong");
  const userEmpID = page.locator("(//span[contains(@class, 'overlay-panel-tag')])[1]");
  const userEmail = page.locator("(//span[contains(@class, 'overlay-panel-tag')])[2]");

  const calendarLocators = {
    calendar: page.locator("//tbody[@class='ng-tns-c133-99']"),
    today: page.locator('//td[contains(@class, "p-datepicker-today")][not(contains(@class, "p-datepicker-other-month"))]//div'),
    holidays: page.locator('//div[contains(@class, "cls-wall-calendar")][contains(@style, "rgb(200, 179, 247)")][not(ancestor::td[contains(@class, "p-datepicker-other-month")])]'),
    absentDays: page.locator('//div[contains(@class, "cls-wall-calendar")][contains(@style, "rgb(242, 124, 124)")][not(ancestor::td[contains(@class, "p-datepicker-other-month")])]'),
    weekends: page.locator('//div[contains(@class, "cls-wall-calendar")][contains(@style, "rgb(232, 235, 237)")][not(ancestor::td[contains(@class, "p-datepicker-other-month")])]'),
    presentDays: page.locator('//div[contains(@class, "cls-wall-calendar")][contains(@style, "rgb(174, 223, 205)")][not(ancestor::td[contains(@class, "p-datepicker-other-month")])]'),
    leaveDays: page.locator('//div[contains(@class, "cls-wall-calendar")][contains(@style, "rgb(232, 182, 137)")][not(ancestor::td[contains(@class, "p-datepicker-other-month")])]'),
  };

  // --- Login Flow ---
  await page.goto("https://app.hrone.cloud/app");
  await page.locator("#hrone-username").fill(loginUser.email);
  await NestAndLogin.click();
  await page.locator("#hrone-password").fill(loginUser.password);
  await NestAndLogin.click();


  await iframe1.locator(".close-btn").waitFor({ state: 'visible' });
  await iframe1.locator(".close-btn").click();


  // --- User Info ---
  await page.locator("div[role='dialog'] .material-icons").click();
  const user = page.locator(".link-on-hover").first();
  await user.hover();
  await userName.waitFor({ state: 'visible' });
  const name = await userName.textContent();
  const empId = await userEmpID.textContent();
  const email = await userEmail.textContent();
  console.log('Name:', name);
  console.log('Employee ID:', empId);
  console.log('Email:', email);
  await page.mouse.move(0, 0);

  // --- Calendar Data Extraction ---
  const month = await page.locator('button.p-datepicker-month').textContent();
  const year = await page.locator('button.p-datepicker-year').textContent();
  const fullDate = `${month.trim()} ${year.trim()}`;

  const calendarData = {
    today: await getDates(calendarLocators.today),
    holidays: await getDates(calendarLocators.holidays),
    absentDays: await getDates(calendarLocators.absentDays),
    weekends: await getDates(calendarLocators.weekends),
    presentDays: await getDates(calendarLocators.presentDays),
    leaveDays: await getDates(calendarLocators.leaveDays)
  };
  console.log('Attendance day Month Year:', calendarData.today[0] + ' ' + fullDate);
  console.log('Calendar Data:', calendarData);

  // --- On Duty Application ---
  await page.locator("div .cls-drop").click();
  await page.locator("//button[.//span[text()=' On duty ']]").click();
  await page.locator("//div/button[text()='add on duty dates']").click();
  await page.locator("input[type='radio'][value='range']").click();

  // Click first absent day
  if (calendarData.absentDays.length > 0) {
    const firstAbsentLocator = page.locator(`//td[not(contains(@class, 'p-datepicker-other-month'))]//div[contains(@class, 'cls-full-absent') and normalize-space(.)='${calendarData.absentDays[0]}']`);
    await firstAbsentLocator.waitFor({ state: 'visible' });
    await firstAbsentLocator.click();
    await page.waitForTimeout(500);
  }

  // Select today
  await calendarLocators.today.click();

  // Select reason and fill comments
  await page.locator('mat-select[formcontrolname="reason"]').click();
  await page.waitForTimeout(500);
  await page.locator(`//mat-option[.//span[normalize-space(.)='${onDutyReason}']]`).click();
  await page.locator("//label[.//text()[normalize-space()='Comments']]").fill(comments);
  await page.waitForTimeout(500);

  // Click Add Button
  await page.locator("//div//button[contains(@class, 'btn-success') and normalize-space(text())='add']").click();

  // --- Remove All Weekend Minus Icons ---
  const WeekendsRows = page.locator("//tr[contains(@style, 'rgba(236, 145, 51, 0.2)')]//i[contains(@class, 'fa-circle-minus')]");
  const WeekendsRowsCount = await WeekendsRows.count();
  await clickAllVisible(WeekendsRows, page, 300);
   console.log('Weekends count:', WeekendsRowsCount);

  // --- Update On Duty Records ---
  const updateTime = page.locator('.click-div .fa-solid');
  await updateTime.first().waitFor({ state: 'visible' });
  const finalCount = await updateTime.count();
  console.log('Submitted On Duty count:', finalCount);
  

  for (let i = 0; i < finalCount; i++) {
    await updateTime.nth(i).click();
    await page.locator("//button[text()='Update']").click();
  }
 
  
  await page.locator("//button[@type='button']").click();

  const headerLocator = page.locator('.p-dialog-content h2');

  await expect(headerLocator).toHaveText('Confirmed!');


  await page.waitForTimeout(5000);


});
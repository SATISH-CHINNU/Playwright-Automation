const { test, expect } = require('@playwright/test');

test.only('HrOne_portal', async ({ page }) => {

const loginUser = {
    email: "silari.kumar@celsiortech.com",
    password: "Schinnu@028",

};

    const NestAndLogin =  page.locator('.ladda-label:visible');
    const iframe1 = page.frameLocator('iframe#_blitz-frame');
    const dialogPopup = page.locator(".dialogContentInner");
    const userName = page.locator("//div[contains(@class, 'message-container')]//h2//strong");
    const userEmpID = page.locator("//div//span[contains(@class, 'overlay-panel-tag')][1]").first();
    const userEmail = page.locator("//div//span[contains(@class, 'overlay-panel-tag')][1]").nth(1);


const calendarLocators = {
  calendar: page.locator("//tbody[@class='ng-tns-c133-99']"),
  today: page.locator('//td[contains(@class, "p-datepicker-today")][not(contains(@class, "p-datepicker-other-month"))]//div'),
  holidays: page.locator('//div[contains(@class, "cls-wall-calendar")][contains(@style, "rgb(200, 179, 247)")][not(ancestor::td[contains(@class, "p-datepicker-other-month")])]'),
  absentDays: page.locator('//div[contains(@class, "cls-wall-calendar")][contains(@style, "rgb(242, 124, 124)")][not(ancestor::td[contains(@class, "p-datepicker-other-month")])]'),
  weekends: page.locator('//div[contains(@class, "cls-wall-calendar")][contains(@style, "rgb(232, 235, 237)")][not(ancestor::td[contains(@class, "p-datepicker-other-month")])]'),
  presentDays: page.locator('//div[contains(@class, "cls-wall-calendar")][contains(@style, "rgb(174, 223, 205)")][not(ancestor::td[contains(@class, "p-datepicker-other-month")])]'),
  leaveDays: page.locator('//div[contains(@class, "cls-wall-calendar")][contains(@style, "rgb(232, 182, 137)")][not(ancestor::td[contains(@class, "p-datepicker-other-month")])]')
};



 await page.goto("https://app.hrone.cloud/app");
 await page.locator("#hrone-username").fill(loginUser.email);
 await NestAndLogin.click();
 await page.locator("#hrone-password").fill(loginUser.password);
 await NestAndLogin.click();

 await iframe1.locator(".close-btn").waitFor({ state: 'visible' });
 await iframe1.locator(".close-btn").click();

 //await dialogPopup.nth(1).locator(".btnclose").click();

 await page.locator("div[role='dialog'] .material-icons").click();

 //await page.locator(".p-datepicker-prev-icon").click();

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

const month = await page.locator('button.p-datepicker-month').textContent();
const year = await page.locator('button.p-datepicker-year').textContent();

const fullDate = `${month.trim()} ${year.trim()}`;





// Function to extract dates from locator
async function getDates(locator) {
  const dates = [];
  const count = await locator.count();
  
  for (let i = 0; i < count; i++) {
    const date = await locator.nth(i).textContent();
    dates.push(date.trim());
  }
  
  return dates;
}

// Extract all dates
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


await page.locator("div .cls-drop").click();

await page.locator("//button[.//span[text()=' On duty ']]").click();

await page.locator("//div/button[text()='add on duty dates']").click();

await page.locator("input[type='radio'][value='range']").click();

const firstAbsentLocator = page.locator(`//td[not(contains(@class, 'p-datepicker-other-month'))]//div[contains(@class, 'cls-full-absent') and normalize-space(.)='${calendarData.absentDays[0]}']`); 
await firstAbsentLocator.waitFor({ state: 'visible' });
await firstAbsentLocator.click();
await page.waitForTimeout(500);
await calendarLocators.today.click();

await page.locator('mat-select[formcontrolname="reason"]').click();
await page.waitForTimeout(500);
await page.locator("//mat-option[.//span[normalize-space(.)='Work From Home']]").click();
await page.locator("//label[.//text()[normalize-space()='Comments']]").fill('WFH');
await page.waitForTimeout(500);

await page.locator("//div//button[contains(@class, 'btn-success') and normalize-space(text())='add']").click();


const updateTime = page.locator('.click-div .fa-solid');
await updateTime.first().waitFor({ state: 'visible' });
const count = await updateTime.count();
console.log('Total On Duty records:', count);


const WeekendsRows = page.locator("//tr[contains(@style, 'rgba(236, 145, 51, 0.2)')]//i[contains(@class, 'fa-circle-minus')]");
const WeekendsRowsCount = await WeekendsRows.count();
console.log('Weekends count:', WeekendsRowsCount);

let icon = WeekendsRows.first();
while (await icon.isVisible()) {
  await icon.click();
  await page.waitForTimeout(300);
  icon = WeekendsRows.first();
}

const FinalOnDutyCount = await updateTime.count();
console.log('Submitted On Duty count:', FinalOnDutyCount);

for (let i = 0; i < FinalOnDutyCount; i++) {
    await updateTime.nth(i).click(); 
    await page.locator("//button[text()='Update']").click();
}

await page.locator("//button[@type='button']").click();

}
)




























// const calender = await page.locator("//tbody[@class='ng-tns-c133-99']//div[not(ancestor::td[contains(@class, 'p-datepicker-other-month')])]");

// const today = await page.locator('//td[contains(@class, "p-datepicker-today") and not(ancestor::td[contains(@class, "p-datepicker-other-month")]) ]');

// const holydays = await page.locator('//div[contains(@class, "cls-wall-calendar") and contains(@style, "rgb(200, 179, 247)") and not(ancestor::td[contains(@class, "p-datepicker-other-month")]) ]');

// const absentDays = await page.locator('//div[contains(@class, "cls-wall-calendar") and contains(@style, "rgb(242, 124, 124)") and not(ancestor::td[contains(@class, "p-datepicker-other-month")]) ]');

// const SatAndSunday = await page.locator('//div[contains(@class, "cls-wall-calendar") and contains(@style, "rgb(232, 235, 237)") and not(ancestor::td[contains(@class, "p-datepicker-other-month")]) ]');

// const presentDays = await page.locator('//div[ contains(@class, "cls-wall-calendar")  and contains(@style, "rgb(174, 223, 205)")  and not(ancestor::td[contains(@class, "p-datepicker-other-month")]) ]');

// const leaveDays = await page.locator('//div[contains(@class, "cls-wall-calendar") and contains(@style, "rgb(232, 182, 137)") and not(ancestor::td[contains(@class, "p-datepicker-other-month")]) ]');

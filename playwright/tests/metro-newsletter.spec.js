import { test, expect } from '@playwright/test';

test('Newsletter Subscribe', async ({ page }) => {
  // Open  newsletters page
  await page.goto('/newsletters/', {
    waitUntil: 'networkidle'
  });

  // Accept cookies if banner appears
  const acceptCookies = page.locator('button:has-text("Accept")');
  if (await acceptCookies.isVisible()) {
    await acceptCookies.click();
  }

  // Select 1 available newsletter input
  const newsletter1 = page.locator(`button.newsletter__add > svg > use`).nth(0);
  await expect(newsletter1).toBeVisible();
  await newsletter1.click();

  // Select 2 available newsletter input
    const newsletter2 = page.locator(`button.newsletter__add > svg > use`).nth(1);
     await expect(newsletter2).toBeVisible();
    await newsletter2.click()

    const subscriptionselectionpanel=page.locator('.newsletter-popover.in-viewport')
    await expect(subscriptionselectionpanel).toBeVisible();

  // Fill signup email address
  const signupemail =page.getByRole('textbox', { name: 'Email' });
  await signupemail.fill('test123@gmail.com');

  // Select agree to term checkbox
  const agreecheckbox = page.locator(`div.newsletter-signup__field > label > div.newsletter-signup__checkbox-placeholder`);
  await agreecheckbox.check();
  
// Click signuo button
  const signup=page.locator(`span:has-text("Sign Up")`);
  await signup.click();

   const confirmationmsg = page.locator(`//div[normalize-space()='Great, You’re signed up! Remember to check your inbox']`);
 expect(confirmationmsg).toBeTruthy();
 
});

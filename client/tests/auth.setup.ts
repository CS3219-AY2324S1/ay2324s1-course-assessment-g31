import { expect, test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto("https://cs3219-c0869.web.app/sign-in");
  await page
    .getByTestId("sign-in-page-email-input")
    .fill(process.env.REACT_APP_TEST_EMAIL!);
  await page
    .getByTestId("sign-in-page-password-input")
    .fill(process.env.REACT_APP_TEST_PASSWORD!);
  await page.getByTestId("sign-in-page-sign-in-button").click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL("https://cs3219-c0869.web.app/profile");
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await expect(page.getByText(process.env.REACT_APP_TEST_EMAIL!)).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});

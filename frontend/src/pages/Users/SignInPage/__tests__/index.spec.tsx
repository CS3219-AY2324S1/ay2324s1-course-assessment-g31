import { expect, test } from "@playwright/experimental-ct-react";

import { HooksConfig } from "../../../../../playwright";
import SignInPage from "..";

test.use({ viewport: { width: 500, height: 500 } });

test("Should Render", async ({ mount }) => {
  const component = await mount<HooksConfig>(<SignInPage />, {
    hooksConfig: { enableRouting: true },
  });
  await expect(component).toContainText("Sign in to your account");
});

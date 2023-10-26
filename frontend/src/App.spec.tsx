import { expect, test } from "@playwright/experimental-ct-react";

import { HooksConfig } from "../playwright";
import App from "./App";

test.use({ viewport: { width: 500, height: 500 } });

test("Should Render", async ({ mount }) => {
  const component = await mount<HooksConfig>(<App />, {
    hooksConfig: { enableRouting: true },
  });
  await expect(component).toContainText("Questions");
});

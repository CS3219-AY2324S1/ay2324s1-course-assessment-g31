import { expect, test } from "@playwright/experimental-ct-react";

import LandingPage from "..";

test.use({ viewport: { width: 500, height: 500 } });

test("Should Render", async ({ mount }) => {
  const component = await mount(<LandingPage />);
  await expect(component).toContainText("Deploy to the cloud with confidence");
});

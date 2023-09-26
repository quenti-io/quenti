import { collectOrganizationActivity as collectActivity } from "@quenti/enterprise/analytics";

import { inngest } from "../inngest";

export const collectOrganizationActivity = inngest.createFunction(
  { name: "Collect organization activity" },
  { cron: "*/5 * * * *" },
  async () => {
    await collectActivity();
  },
);

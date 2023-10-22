import { collectOrganizationActivity as collectActivity } from "@quenti/enterprise/analytics";
import { prisma } from "@quenti/prisma";

import { inngest } from "../inngest";

export const collectOrganizationActivity = inngest.createFunction(
  { id: "collect-organization-activity" },
  { cron: "*/5 * * * *" },
  async ({ step }) => {
    const organizations = await step.run("Get published organizations", () =>
      prisma.organization.findMany({
        where: {
          published: true,
        },
        select: {
          id: true,
        },
      }),
    );

    await Promise.all(
      organizations.map(({ id }) =>
        step.run("Collect individual organization activity", async () => {
          await collectActivity(id);
        }),
      ),
    );
  },
);

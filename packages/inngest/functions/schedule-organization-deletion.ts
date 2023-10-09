import { sendOrganizationDeletionEmail } from "@quenti/emails";
import { disbandOrgUsers } from "@quenti/enterprise/users";
import { env } from "@quenti/env/server";
import { cancelOrganizationSubscription } from "@quenti/payments";
import { prisma } from "@quenti/prisma";

import { inngest } from "../inngest";

export const scheduleOrgDeletion = inngest.createFunction(
  {
    id: "schedule-org-deletion",
  },
  {
    event: "orgs/delete",
  },
  async ({ event, step }) => {
    await Promise.all(
      event.data.ownerEmails.map((email) =>
        step.run(
          "Send organization deletion email",
          async () =>
            await sendOrganizationDeletionEmail(email, {
              orgName: event.data.org.name,
            }),
        ),
      ),
    );

    if (env.SERVER_NAME === "production") {
      await step.sleep("wait-48-hours", "48h");
    }

    await cancelOrganizationSubscription(event.data.org.id);

    const deleted = await prisma.organization.delete({
      where: {
        id: event.data.org.id,
      },
    });

    await disbandOrgUsers(deleted.id);
  },
);

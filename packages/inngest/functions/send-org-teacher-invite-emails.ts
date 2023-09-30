import { inngest } from "../inngest";

export const sendOrgTeacherInviteEmails = inngest.createFunction(
  { name: "Send organization teacher invite emails" },
  { event: "orgs/invite-teachers" },
  async ({ event, step }) => {
    await Promise.all(
      event.data.emails.map((email) =>
        step.run("Send organization teacher invite email", async () => {
          // TODO: Implement this
        }),
      ),
    );
  },
);

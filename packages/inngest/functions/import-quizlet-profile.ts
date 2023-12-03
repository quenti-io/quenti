import { importIntegration } from "../common/integrations";
import { inngest } from "../inngest";

type Return = {
  importProfile: (
    userId: string,
    username: string,
    step: unknown,
  ) => Promise<void>;
};

export const importQuizletProfile = inngest.createFunction(
  {
    id: "import-quizlet-profile",
  },
  {
    event: "integrations/quizlet/import-profile",
  },
  async ({ event, step }) => {
    const { importProfile } = (await importIntegration(
      "quizlet/inngest",
    )) as Return;

    await importProfile(event.data.userId, event.data.username, step);
  },
);

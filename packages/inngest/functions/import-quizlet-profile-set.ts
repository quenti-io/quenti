import { importIntegration } from "../common/integrations";
import { inngest } from "../inngest";

type Return = {
  importFromUrl: (
    url: string,
    userId: string,
    opts?: {
      session?: boolean;
      publishedTimestamp?: number;
    },
  ) => Promise<{ createdSetId: string; title: string; terms: number }>;
};

export const importQuizletProfileSet = inngest.createFunction(
  {
    id: "import-quizlet-profile-set",
    retries: 4,
    concurrency: {
      limit: 1,
      key: "event.data.userId",
    },
  },
  {
    event: "integrations/quizlet/import-profile-set",
  },
  async ({ event, step }) => {
    const { importFromUrl } = (await importIntegration("quizlet")) as Return;

    const result = await step.run(
      "import-set",
      async () =>
        await importFromUrl(event.data.url, event.data.userId, {
          publishedTimestamp: event.data.publishedTimestamp,
        }),
    );

    await step.sendEvent("debounce-complete-import-profile", {
      name: "integrations/quizlet/complete-import-profile",
      data: {
        userId: event.data.userId,
      },
    });

    return result;
  },
);

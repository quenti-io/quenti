import type { NonNullableUserContext } from "../../lib/types";
import type { TPostQuizletJobSchema } from "./post-quizlet-job.schema";

type PostQuizletJobOptions = {
  ctx: NonNullableUserContext;
  input: TPostQuizletJobSchema;
};

export const postQuizletJobHandler = async ({
  input,
}: PostQuizletJobOptions) => {
  try {
    const { postJob } = await import("@quenti/integrations/quizlet");
    await postJob(input.url);
  } catch {}
};

export default postQuizletJobHandler;

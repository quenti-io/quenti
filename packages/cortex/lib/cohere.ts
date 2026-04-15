import { CohereClient } from "cohere-ai";

import { env } from "@quenti/env/server";

export const cohere = new CohereClient({
  token: env.COHERE_API_KEY,
});

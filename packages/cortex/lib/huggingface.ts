import { HfInferenceEndpoint } from "@huggingface/inference";

import { env } from "@quenti/env/server";

export const Hf =
  env.HUGGINGFACE_ENDPOINT && env.HUGGINGFACE_API_KEY
    ? new HfInferenceEndpoint(env.HUGGINGFACE_ENDPOINT, env.HUGGINGFACE_API_KEY)
    : null;

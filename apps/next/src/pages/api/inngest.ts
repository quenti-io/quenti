import { functions, inngest } from "@quenti/inngest";
import { serve } from "@quenti/inngest/next";

export default serve({ client: inngest, functions });

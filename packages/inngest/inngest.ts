import { EventSchemas, Inngest } from "inngest";

import type { Events } from ".";

export const inngest = new Inngest({
  name: "Quenti",
  schemas: new EventSchemas().fromRecord<Events>(),
});

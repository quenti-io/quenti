import { EventSchemas, Inngest } from "inngest";

import type { Events } from ".";

export const inngest = new Inngest({
  id: "next",
  schemas: new EventSchemas().fromRecord<Events>(),
});

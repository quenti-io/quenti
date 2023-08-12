import type { Events } from ".";
import { EventSchemas, Inngest } from "inngest";

export const inngest = new Inngest({
  name: "Quenti",
  schemas: new EventSchemas().fromRecord<Events>(),
});

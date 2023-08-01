import type { StudySetVisibility } from "@quenti/prisma/client";
import { IconLink, IconLock, IconWorld } from "@tabler/icons-react";

export const visibilityIcon = (visibility: StudySetVisibility, size = 24) => {
  switch (visibility) {
    case "Public":
      return <IconWorld size={size} />;
    case "Unlisted":
      return <IconLink size={size} />;
    case "Private":
      return <IconLock size={size} />;
  }
};

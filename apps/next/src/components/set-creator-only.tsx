import { useSession } from "next-auth/react";
import React from "react";

import { useSetFolderUnison } from "../hooks/use-set-folder-unison";

export interface SetCreatorOnlyProps {
  /// Include to force a specific value, otherwise inferred from context
  studySetId?: string;
  fallback?: React.ReactElement;
}

export const SetCreatorOnly: React.FC<
  React.PropsWithChildren<SetCreatorOnlyProps>
> = ({ children, studySetId, fallback }) => {
  const session = useSession();
  const { entityType, userId, editableSets } = useSetFolderUnison();

  if (
    (entityType == "set" && session.data?.user?.id === userId) ||
    (studySetId && editableSets?.includes(studySetId))
  ) {
    return <>{children}</>;
  }
  return fallback ?? null;
};

import { useSession } from "next-auth/react";
import React from "react";
import { useSetFolderUnison } from "../hooks/use-set-folder-unison";

export interface SetCreatorOnlyProps {
  /// Include to force a specific value, otherwise inferred from context
  studySetId?: string;
}

export const SetCreatorOnly: React.FC<
  React.PropsWithChildren<SetCreatorOnlyProps>
> = ({ children, studySetId }) => {
  const session = useSession();
  const { type, userId, editableSets } = useSetFolderUnison();

  if (
    (type == "set" && session.data?.user?.id === userId) ||
    (studySetId && editableSets?.includes(studySetId))
  ) {
    return <>{children}</>;
  }
  return null;
};

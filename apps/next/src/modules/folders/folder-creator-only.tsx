import { useSession } from "next-auth/react";
import React from "react";

import { useFolder } from "../../hooks/use-folder";

export const FolderCreatorOnly: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const session = useSession();
  const folder = useFolder();

  if (folder.user.id !== session.data?.user?.id) return null;

  return <>{children}</>;
};

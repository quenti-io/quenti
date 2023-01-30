import { useSession } from "next-auth/react";
import React from "react";
import { useSet } from "../hooks/use-set";

export const SetCreatorOnly: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const session = useSession();
  const { userId } = useSet();

  if (session.data?.user?.id !== userId) {
    return null;
  }
  return <>{children}</>;
};

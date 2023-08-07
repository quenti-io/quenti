import { useSession } from "next-auth/react";

export const UnboundOnly: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const session = useSession();
  if (!session.data?.user || session.data.user.organizationId) return null;

  return <>{children}</>;
};

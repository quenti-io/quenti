import { useSession } from "next-auth/react";

export const OrganizationBoundOnly: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data: session } = useSession();

  if (session?.user?.organizationId) return <>{children}</>;
  return null;
};

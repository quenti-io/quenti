import { useSession } from "next-auth/react";

export interface AuthedProps {
  fallback?: React.ReactNode;
}

export const Authed: React.FC<React.PropsWithChildren<AuthedProps>> = ({
  children,
  fallback = null,
}) => {
  const { status } = useSession();
  if (status != "authenticated") return <>{fallback}</>;

  return <>{children}</>;
};

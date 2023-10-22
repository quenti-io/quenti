import { useSession } from "next-auth/react";

export interface AuthedProps {
  fallback?: React.ReactNode;
  nullOnLoad?: boolean;
}

export const Authed: React.FC<React.PropsWithChildren<AuthedProps>> = ({
  children,
  fallback = null,
  nullOnLoad,
}) => {
  const { status } = useSession();
  if (status == "loading" && nullOnLoad) return null;
  if (status != "authenticated") return <>{fallback}</>;

  return <>{children}</>;
};

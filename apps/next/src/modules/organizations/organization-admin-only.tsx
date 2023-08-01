import { useOrganization } from "../../hooks/use-organization";

export const OrganizationAdminOnly: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const org = useOrganization();

  if (!org) return null;
  if (org.me.role !== "Admin" && org.me.role !== "Owner") return null;

  return <>{children}</>;
};

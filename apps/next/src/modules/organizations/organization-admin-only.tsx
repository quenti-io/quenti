import { useOrganizationMember } from "../../hooks/use-organization-member";

export const OrganizationAdminOnly: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const me = useOrganizationMember();

  if (!me) return null;
  if (me.role !== "Admin" && me.role !== "Owner") return null;

  return <>{children}</>;
};

import { useMe } from "../hooks/use-me";

export interface UnboundOnlyProps {
  strict?: boolean;
}

export const UnboundOnly: React.FC<
  React.PropsWithChildren<UnboundOnlyProps>
> = ({ children, strict }) => {
  const { data: me } = useMe();
  if (!me || (me.organization && (!me.orgMembership || strict))) return null;

  return <>{children}</>;
};

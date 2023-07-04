import { useSetReady } from "../hooks/use-set";

export const SetReady: React.FC<React.PropsWithChildren> = ({ children }) => {
  const ready = useSetReady();

  if (!ready) return null;

  return <>{children}</>;
};

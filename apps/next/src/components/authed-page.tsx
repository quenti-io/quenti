import React from "react";

import { useUnauthedRedirect } from "../hooks/use-unauthed-redirect";

export const AuthedPage: React.FC<React.PropsWithChildren> = ({ children }) => {
  useUnauthedRedirect();
  return <>{children}</>;
};

import type React from "react";

export interface AuthEnabledComponentConfig {
  authenticationEnabled: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentWithAuth<PropsType = any> = React.FC<PropsType> &
  AuthEnabledComponentConfig;

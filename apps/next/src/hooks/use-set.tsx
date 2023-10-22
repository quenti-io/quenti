import React from "react";

import type { AuthedData } from "../modules/hydrate-set-data";
import { SetContext } from "../modules/hydrate-set-data";

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
export const useSet = () => React.useContext(SetContext)!.data;
export const useAuthedSet = () =>
  React.useContext(SetContext)!.data as AuthedData;

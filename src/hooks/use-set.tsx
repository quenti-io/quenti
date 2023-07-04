import React from "react";
import { SetContext, type SetData } from "../modules/hydrate-set-data";
import type { AuthedData } from "../modules/hydrate-set-data";

export const useSetReady = () => !!React.useContext(SetContext)!.data;
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
export const useSet = () => (React.useContext(SetContext)!.data || {}) as SetData;
export const useAuthedSet = () =>
  React.useContext(SetContext)!.data as AuthedData;

import React from "react";
import { SetContext } from "../modules/hydrate-set-data";
import type { AuthedData } from "../modules/hydrate-set-data";

export const useSet = () => React.useContext(SetContext)!.data;
export const useAuthedSet = () =>
  React.useContext(SetContext)!.data as AuthedData;

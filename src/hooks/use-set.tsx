import React from "react";
import { SetContext } from "../modules/hydrate-set-data";

export const useSet = () => React.useContext(SetContext)!.data;

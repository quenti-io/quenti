import React from "react";

import { HistoryContext } from "../modules/history-provider";

export const useHistory = () => React.useContext(HistoryContext);

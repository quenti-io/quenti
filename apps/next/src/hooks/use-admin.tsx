import React from "react";

import { AdminContext } from "../modules/hydrate-admin";

export const useAdmin = () => React.useContext(AdminContext)!;

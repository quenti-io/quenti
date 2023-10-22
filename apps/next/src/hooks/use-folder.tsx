import React from "react";

import { FolderContext } from "../modules/hydrate-folder-data";

export const useFolder = () => React.useContext(FolderContext);

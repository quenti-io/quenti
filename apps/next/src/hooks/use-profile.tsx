import React from "react";

import { ProfileContext } from "../modules/hydrate-profile-data";

export const useProfile = () => React.useContext(ProfileContext);

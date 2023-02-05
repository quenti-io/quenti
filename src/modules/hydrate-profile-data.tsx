import { useRouter } from "next/router";
import React from "react";
import { Loading } from "../components/loading";
import { api, type RouterOutputs } from "../utils/api";
import { Profile404 } from "./profile/profile-404";

type ProfileData = RouterOutputs["profile"]["get"];
export const ProfileContext = React.createContext<ProfileData>({
  id: "",
  username: "",
  image: "",
  verified: false,
  studySets: [],
  folders: [],
});

export const HydrateProfileData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const username = router.query.username as string;
  const profile = api.profile.get.useQuery(username.substring(1), {
    retry: false,
  });

  if (profile.error?.data?.httpStatus === 404) return <Profile404 />;
  if (!profile.data) return <Loading />;

  return (
    <ProfileContext.Provider value={profile.data}>
      {children}
    </ProfileContext.Provider>
  );
};

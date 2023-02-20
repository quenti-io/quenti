import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Loading } from "../components/loading";
import { useLoading } from "../hooks/use-loading";
import { api, type RouterOutputs } from "../utils/api";
import { Profile404 } from "./profile/profile-404";

type ProfileData = RouterOutputs["profile"]["get"];
export const ProfileContext = React.createContext<ProfileData>({
  id: "",
  username: "",
  image: "",
  verified: false,
  name: "",
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
  const { loading } = useLoading();

  if (profile.error?.data?.httpStatus === 404) return <Profile404 />;
  if (loading || !profile.data) return <Loading />;

  return (
    <ProfileContext.Provider value={profile.data}>
      <Head>
        <title>{profile.data.username} | Quizlet.cc</title>
      </Head>
      {children}
    </ProfileContext.Provider>
  );
};

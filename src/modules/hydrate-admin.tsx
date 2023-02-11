import { useRouter } from "next/router";
import React from "react";
import { Loading } from "../components/loading";
import { useLoading } from "../hooks/use-loading";
import { api, type RouterOutputs } from "../utils/api";

type LandingData = RouterOutputs["admin"]["landing"];
export const AdminContext = React.createContext<LandingData>({
  users: [],
  experiences: 0,
  folders: 0,
  studySets: 0,
  terms: 0,
  studiableTerms: 0,
  starredTerms: 0,
});

export const HydrateAdmin: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();

  const { data } = api.admin.landing.useQuery(undefined, {
    retry: false,
    onError: (error) => {
      void (async () => {
        if (error.data?.httpStatus == 401) {
          await router.push("/home");
        }
      })();
    },
  });
  const { loading } = useLoading();

  if (loading || !data) return <Loading />;

  return <AdminContext.Provider value={data}>{children}</AdminContext.Provider>;
};

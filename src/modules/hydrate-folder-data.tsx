import { useRouter } from "next/router";
import React from "react";
import { Loading } from "../components/loading";
import { api, RouterOutputs } from "../utils/api";

type FolderData = RouterOutputs["folders"]["get"];
export const FolderContext = React.createContext<FolderData>({
  id: "",
  title: "",
  description: "",
  sets: [],
  user: {
    id: "",
    username: "",
    image: "",
    verified: false,
  },
});

export const HydrateFolderData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const username = router.query.username as string;
  const slug = router.query.slug as string;

  const folder = api.folders.get.useQuery({ username: username.slice(1), slug });

  if (!folder.data) return <Loading />;

  return (
    <FolderContext.Provider value={folder.data}>
      {children}
    </FolderContext.Provider>
  );
};

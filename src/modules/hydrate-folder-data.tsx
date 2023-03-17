import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Loading } from "../components/loading";
import { useLoading } from "../hooks/use-loading";
import {
  createExperienceStore,
  ExperienceContext,
  type ExperienceStore,
  type ExperienceStoreProps,
} from "../stores/use-experience-store";
import { api, type RouterOutputs } from "../utils/api";
import { Folder404 } from "./folders/folder-404";
import { NoPublicSets } from "./folders/no-public-sets";

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
  experience: {
    id: "",
    folderId: "",
    shuffleFlashcards: false,
    userId: "",
    viewedAt: new Date(),
    starredTerms: [],
  },
  terms: [],
  editableSets: [],
});

export interface HydrateFolderDataProps {
  withTerms?: boolean;
}

export const HydrateFolderData: React.FC<
  React.PropsWithChildren<HydrateFolderDataProps>
> = ({ children, withTerms = false }) => {
  const router = useRouter();
  const username = router.query.username as string;
  const slug = router.query.slug as string;
  const { loading } = useLoading();

  const folder = api.folders.get.useQuery(
    {
      username: (username || "").slice(1),
      idOrSlug: slug,
      includeTerms: withTerms,
    },
    { retry: false, enabled: !!username }
  );

  if (folder.error?.data?.httpStatus === 404) return <Folder404 />;
  if (folder.error?.data?.httpStatus === 403) return <NoPublicSets />;
  if (loading || !folder.data) return <Loading />;

  return (
    <ContextLayer data={folder.data}>
      <Head>
        <title>{folder.data.title} | Quizlet.cc</title>
      </Head>
      {children}
    </ContextLayer>
  );
};

const ContextLayer: React.FC<React.PropsWithChildren<{ data: FolderData }>> = ({
  data,
  children,
}) => {
  const getVal = (data: FolderData): Partial<ExperienceStoreProps> => ({
    shuffleFlashcards: data.experience.shuffleFlashcards,
    starredTerms: data.experience.starredTerms,
  });

  const storeRef = React.useRef<ExperienceStore>();
  if (!storeRef.current) {
    storeRef.current = createExperienceStore(getVal(data));
  }

  return (
    <FolderContext.Provider value={data}>
      <ExperienceContext.Provider value={storeRef.current}>
        {children}
      </ExperienceContext.Provider>
    </FolderContext.Provider>
  );
};

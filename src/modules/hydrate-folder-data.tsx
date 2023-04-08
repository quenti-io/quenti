import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Loading } from "../components/loading";
import { queryEventChannel } from "../events/query";
import { useLoading } from "../hooks/use-loading";
import {
  createExperienceStore,
  ExperienceContext,
  type ExperienceStore,
  type ExperienceStoreProps,
} from "../stores/use-experience-store";
import { useSetPropertiesStore } from "../stores/use-set-properties-store";
import { api, type RouterOutputs } from "../utils/api";
import { Folder404 } from "./folders/folder-404";
import { NoPublicSets } from "./folders/no-public-sets";

export type FolderData = RouterOutputs["folders"]["get"];
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
    studiableTerms: [],
    enableCardsSorting: false,
    cardsRound: 0,
    cardsStudyStarred: false,
    cardsAnswerWith: "Definition",
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

  const [isDirty, setIsDirty] = useSetPropertiesStore((s) => [
    s.isDirty,
    s.setIsDirty,
  ]);

  const folder = api.folders.get.useQuery(
    {
      username: (username || "").slice(1),
      idOrSlug: slug,
      includeTerms: withTerms,
    },
    {
      retry: false,
      enabled: !!username && !isDirty,
      onSuccess: (data) => {
        if (isDirty) setIsDirty(false);
        queryEventChannel.emit("folderQueryRefetched", data);
      },
    }
  );

  React.useEffect(() => {
    void (async () => {
      if (isDirty) await folder.refetch();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

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
    enableCardsSorting: data.experience.enableCardsSorting,
    cardsStudyStarred: data.experience.cardsStudyStarred,
    cardsAnswerWith: data.experience.cardsAnswerWith,
  });

  const storeRef = React.useRef<ExperienceStore>();
  if (!storeRef.current) {
    storeRef.current = createExperienceStore(getVal(data));
  }

  React.useEffect(() => {
    const trigger = (data: FolderData) => {
      storeRef.current?.setState(getVal(data));
    };

    queryEventChannel.on("folderQueryRefetched", trigger);
    return () => {
      queryEventChannel.off("folderQueryRefetched", trigger);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FolderContext.Provider value={data}>
      <ExperienceContext.Provider value={storeRef.current}>
        {children}
      </ExperienceContext.Provider>
    </FolderContext.Provider>
  );
};

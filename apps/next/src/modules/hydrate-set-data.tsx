import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

import { EnabledFeature } from "@quenti/lib/feature";
import type { Widen } from "@quenti/lib/widen";
import { type RouterOutputs, api } from "@quenti/trpc";

import { Loading } from "../components/loading";
import { queryEventChannel } from "../events/query";
import { useFeature } from "../hooks/use-feature";
import {
  ContainerContext,
  type ContainerStore,
  type ContainerStoreProps,
  createContainerStore,
} from "../stores/use-container-store";
import { useSetPropertiesStore } from "../stores/use-set-properties-store";
import { Set404 } from "./main/set-404";
import { SetPrivate } from "./main/set-private";

type AuthedReturn = RouterOutputs["studySets"]["byId"];
type BaseReturn = Widen<AuthedReturn | RouterOutputs["studySets"]["getPublic"]>;
type StudiableType = AuthedReturn["container"]["studiableTerms"][number];
export type SetData = BaseReturn & {
  authed: boolean;
  injected?: {
    studiableLearnTerms: StudiableType[];
    studiableFlashcardTerms: StudiableType[];
  };
};
export type AuthedData = AuthedReturn & {
  authed: boolean;
  injected: {
    studiableLearnTerms: StudiableType[];
    studiableFlashcardTerms: StudiableType[];
  };
};

export interface HydrateSetDataProps {
  isPublic?: boolean;
  withDistractors?: boolean;
  withCollab?: boolean;
  disallowDirty?: boolean;
  requireFresh?: boolean;
  placeholder?: React.ReactNode;
}

export const HydrateSetData: React.FC<
  React.PropsWithChildren<HydrateSetDataProps>
> = ({
  isPublic,
  withDistractors = false,
  withCollab = false,
  disallowDirty = false,
  requireFresh,
  placeholder,
  children,
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const id = router.query.id as string;

  const [isDirty, setIsDirty] = useSetPropertiesStore((s) => [
    s.isDirty,
    s.setIsDirty,
  ]);

  const queryKey = status == "authenticated" ? "byId" : "getPublic";
  const { data, error, refetch, isFetchedAfterMount } = (
    api.studySets[queryKey] as typeof api.studySets.byId
  ).useQuery(
    { studySetId: id, withDistractors, withCollab },
    {
      enabled: status !== "loading" && !!id && !isDirty,
      onSuccess: (data) => {
        if (isDirty) setIsDirty(false);
        queryEventChannel.emit("setQueryRefetched", createInjectedData(data));
      },
      onError: (err) => {
        if (err.data?.httpStatus == 412) {
          void router.push(`/${id}/create`);
        }
      },
    },
  );

  React.useEffect(() => {
    if (isDirty) void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  const createInjectedData = (data: BaseReturn): SetData => {
    const terms = data.collaborators
      ? data.terms.map((t) => ({
          ...t,
          ...(t.authorId
            ? { author: data.collaborators!.find((c) => c.id == t.authorId) }
            : {}),
        }))
      : data.terms;

    if (!data.container) return { ...data, terms, authed: false };

    const studiableLearnTerms = data.container.studiableTerms.filter(
      (t) => t.mode == "Learn",
    );
    const studiableFlashcardTerms = data.container.studiableTerms.filter(
      (t) => t.mode == "Flashcards",
    );
    return {
      ...data,
      terms,
      authed: true,
      injected: {
        studiableLearnTerms,
        studiableFlashcardTerms,
      },
    };
  };

  if (error?.data?.httpStatus == 404) return <Set404 />;
  if ([401, 403].includes(error?.data?.httpStatus || 0)) return <SetPrivate />;
  if (
    status == "loading" ||
    (!isPublic && !session) ||
    !data ||
    (disallowDirty && isDirty) ||
    (!isFetchedAfterMount && requireFresh)
  )
    return placeholder || <Loading />;

  return (
    <ContextLayer data={createInjectedData(data)}>
      <Head>
        <title>{data.title} | Quenti</title>
      </Head>
      {children}
    </ContextLayer>
  );
};

interface ContextLayerProps {
  data: SetData;
}

interface SetContextProps {
  data: SetData;
}

export const SetContext = React.createContext<SetContextProps | undefined>(
  undefined,
);

const ContextLayer: React.FC<React.PropsWithChildren<ContextLayerProps>> = ({
  data,
  children,
}) => {
  const { status } = useSession();
  const extendedFeedbackBank = useFeature(EnabledFeature.ExtendedFeedbackBank);

  const getVal = (data: AuthedData): Partial<ContainerStoreProps> => ({
    shuffleFlashcards: data.container.shuffleFlashcards,
    shuffleLearn: data.container.shuffleLearn,
    studyStarred: data.container.studyStarred,
    answerWith: data.container.answerWith,
    starredTerms: data.container.starredTerms,
    multipleAnswerMode: data.container.multipleAnswerMode,
    extendedFeedbackBank:
      data.container.extendedFeedbackBank && extendedFeedbackBank,
    enableCardsSorting: data.container.enableCardsSorting,
    cardsStudyStarred: data.container.cardsStudyStarred,
    cardsAnswerWith: data.container.cardsAnswerWith,
    matchStudyStarred: data.container.matchStudyStarred,
  });

  const storeRef = React.useRef<ContainerStore>();
  if (!storeRef.current) {
    storeRef.current = createContainerStore(
      status == "authenticated" ? getVal(data as AuthedData) : undefined,
    );
  }

  React.useEffect(() => {
    const trigger = (data: SetData) => {
      if (status == "authenticated")
        storeRef.current?.setState(getVal(data as AuthedData));
    };

    queryEventChannel.on("setQueryRefetched", trigger);
    return () => {
      queryEventChannel.off("setQueryRefetched", trigger);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SetContext.Provider value={{ data }}>
      <ContainerContext.Provider value={storeRef.current}>
        {children}
      </ContainerContext.Provider>
    </SetContext.Provider>
  );
};

export default HydrateSetData;

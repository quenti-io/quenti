import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Loading } from "../components/loading";
import { queryEventChannel } from "../events/query";
import { useFeature } from "../hooks/use-feature";
import { useLoading } from "../hooks/use-loading";
import {
  createExperienceStore,
  ExperienceContext,
  type ExperienceStore,
  type ExperienceStoreProps,
} from "../stores/use-experience-store";
import { useSetPropertiesStore } from "../stores/use-set-properties-store";
import { api, type RouterOutputs } from "../utils/api";
import { Set404 } from "./main/set-404";
import { SetPrivate } from "./main/set-private";

type BaseReturn = RouterOutputs["studySets"]["byId"];
type StudiableType = BaseReturn["experience"]["studiableTerms"][number];
export type SetData = BaseReturn & {
  injected: {
    studiableLearnTerms: StudiableType[];
    studiableFlashcardTerms: StudiableType[];
  };
};

export interface HydrateSetDataProps {
  disallowDirty?: boolean;
}

export const HydrateSetData: React.FC<
  React.PropsWithChildren<HydrateSetDataProps>
> = ({ disallowDirty = false, children }) => {
  const id = useRouter().query.id as string;
  const [isDirty, setIsDirty] = useSetPropertiesStore((s) => [
    s.isDirty,
    s.setIsDirty,
  ]);
  const { loading } = useLoading();

  const { data, error, refetch } = api.studySets.byId.useQuery(id, {
    retry: false,
    enabled: !!id && !isDirty,
    onSuccess: (data) => {
      if (isDirty) setIsDirty(false);
      queryEventChannel.emit("setQueryRefetched", createInjectedData(data));
    },
  });

  React.useEffect(() => {
    void (async () => {
      if (isDirty) await refetch();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  const createInjectedData = (data: BaseReturn): SetData => {
    const studiableLearnTerms = data.experience.studiableTerms.filter(
      (t) => t.mode == "Learn"
    );
    const studiableFlashcardTerms = data.experience.studiableTerms.filter(
      (t) => t.mode == "Flashcards"
    );
    return {
      ...data,
      injected: {
        studiableLearnTerms,
        studiableFlashcardTerms,
      },
    };
  };

  if (error?.data?.httpStatus == 404) return <Set404 />;
  if (error?.data?.httpStatus == 403) return <SetPrivate />;
  if (loading || !data || (disallowDirty && isDirty)) return <Loading />;

  return (
    <ContextLayer data={createInjectedData(data)}>
      <Head>
        <title>{data.title} | Quizlet.cc</title>
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
  undefined
);

const ContextLayer: React.FC<React.PropsWithChildren<ContextLayerProps>> = ({
  data,
  children,
}) => {
  const extendedFeedbackBank = useFeature("ExtendedFeedbackBank");

  const getVal = (data: SetData): Partial<ExperienceStoreProps> => ({
    shuffleFlashcards: data.experience.shuffleFlashcards,
    shuffleLearn: data.experience.shuffleLearn,
    studyStarred: data.experience.studyStarred,
    answerWith: data.experience.answerWith,
    starredTerms: data.experience.starredTerms,
    multipleAnswerMode: data.experience.multipleAnswerMode,
    extendedFeedbackBank:
      data.experience.extendedFeedbackBank && extendedFeedbackBank,
    enableCardsSorting: data.experience.enableCardsSorting,
    cardsStudyStarred: data.experience.cardsStudyStarred,
    cardsAnswerWith: data.experience.cardsAnswerWith,
  });

  const storeRef = React.useRef<ExperienceStore>();
  if (!storeRef.current) {
    storeRef.current = createExperienceStore(getVal(data));
  }

  React.useEffect(() => {
    const trigger = (data: SetData) => {
      storeRef.current?.setState(getVal(data));
    };

    queryEventChannel.on("setQueryRefetched", trigger);
    return () => {
      queryEventChannel.off("setQueryRefetched", trigger);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SetContext.Provider value={{ data }}>
      <ExperienceContext.Provider value={storeRef.current}>
        {children}
      </ExperienceContext.Provider>
    </SetContext.Provider>
  );
};

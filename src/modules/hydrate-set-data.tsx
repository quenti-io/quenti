import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Loading } from "../components/loading";
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
    enabled: !!id && !(disallowDirty && isDirty),
    onSuccess: () => {
      if (disallowDirty && isDirty) setIsDirty(false);
    },
  });

  React.useEffect(() => {
    void (async () => {
      if (disallowDirty && isDirty) await refetch();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  if (error?.data?.httpStatus == 404) return <Set404 />;
  if (error?.data?.httpStatus == 403) return <SetPrivate />;
  if (loading || !data || (disallowDirty && isDirty)) return <Loading />;

  return (
    <ContextLayer data={data}>
      <Head>
        <title>{data.title} | Quizlet.cc</title>
      </Head>
      {children}
    </ContextLayer>
  );
};

type SetData = RouterOutputs["studySets"]["byId"];

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
  });

  const storeRef = React.useRef<ExperienceStore>();
  if (!storeRef.current) {
    storeRef.current = createExperienceStore(getVal(data));
  }

  return (
    <SetContext.Provider value={{ data }}>
      <ExperienceContext.Provider value={storeRef.current}>
        {children}
      </ExperienceContext.Provider>
    </SetContext.Provider>
  );
};

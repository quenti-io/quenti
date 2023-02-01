import React from "react";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import type { SetData } from "../interfaces/set-data";
import {
  createExperienceStore,
  ExperienceContext,
  type ExperienceStore,
  type ExperienceStoreProps,
} from "../stores/use-experience-store";
import { Loading } from "../components/loading";
import { SetPrivate } from "../components/set-private";

export const HydrateSetData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const id = useRouter().query.id as string;
  const { data, error } = api.studySets.byId.useQuery(id, {
    retry: false,
  });

  if (error?.data?.httpStatus == 403) return <SetPrivate />;
  if (!data) return <Loading />;

  return <ContextLayer data={data}>{children}</ContextLayer>;
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
  const getVal = (data: SetData): Partial<ExperienceStoreProps> => ({
    shuffleFlashcards: data.experience.shuffleFlashcards,
    starredTerms: data.experience.starredTerms,
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

import type { Language } from "@quenti/core";
import { strip } from "@quenti/lib/strip";
import type { Widen } from "@quenti/lib/widen";
import type { StudySetVisibility } from "@quenti/prisma/client";

import { TRPCError } from "@trpc/server";

import type { DefaultContext } from "../../lib/types";
import type { TGetPublicSchema } from "./get-public.schema";
import type { AwaitedGet, AwaitedGetWithCollab, Collaborator } from "./queries";
import { get, getWithCollab } from "./queries";

type GetPublicOptions = {
  ctx: DefaultContext;
  input: TGetPublicSchema;
};

type Widened = AwaitedGet | AwaitedGetWithCollab;
type WidenedReturn = Widen<Widened> & {
  createdAt: Date;
  savedAt: Date;
};
type WidenedTerm = Widen<Widened["terms"][number]>;

export const getPublicHandler = async ({ input }: GetPublicOptions) => {
  const studySet = (
    input.withCollab
      ? await getWithCollab(input.studySetId)
      : await get(input.studySetId)
  ) as WidenedReturn;

  if (!studySet || !studySet.created) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  if (
    !(["Public", "Unlisted"] as StudySetVisibility[]).includes(
      studySet.visibility,
    )
  ) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return {
    ...studySet,
    assignment: undefined,
    ...strip({
      collaborators: (studySet.collaborators as Collaborator[])
        ?.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
        .map((c) => ({
          id: c.user.id,
          image: c.user.image,
          username: c.user.username,
          name: c.user.displayName ? c.user.name : undefined,
        })),
    }),
    terms: studySet.terms as WidenedTerm[],
    tags: studySet.tags as string[],
    wordLanguage: studySet.wordLanguage as Language,
    definitionLanguage: studySet.definitionLanguage as Language,
    user: {
      id: studySet.user.id,
      username: studySet.user.username,
      image: studySet.user.image!,
      name: studySet.user.displayName ? studySet.user.name : null,
      verified: studySet.user.verified,
    },
  };
};

export default getPublicHandler;

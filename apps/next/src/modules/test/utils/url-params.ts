import type { NextRouter } from "next/router";
import { z } from "zod";

import {
  DEFAULT_PROPS,
  type TestStoreProps,
} from "../../../stores/use-test-store";
import { getBitwiseForTypes, getQuestionTypesFromBitwise } from "./type";

const settingsSchema = z.object({
  count: z.number().int().min(1),
  answerMode: z.enum(["Word", "Definition", "Both"]),
  types: z.number().int(),
  starred: z.boolean(),
});

export const pushQueryParams = (
  id: string,
  settings: TestStoreProps["settings"],
  router: NextRouter,
) => {
  const { questionCount, questionTypes, answerMode, studyStarred } = settings;
  const params = new URLSearchParams();

  params.set("count", questionCount.toString());
  params.set("answerMode", answerMode);
  params.set("types", getBitwiseForTypes(questionTypes).toString());
  params.set("starred", studyStarred ? "true" : "false");

  void router.replace({ pathname: `/${id}/test`, query: params.toString() });
};

export const getQueryParams = (): {
  settings: TestStoreProps["settings"];
  valid: boolean;
} => {
  const params = new URLSearchParams(window.location.search);
  try {
    const settings = settingsSchema.parse({
      count: parseInt(params.get("count") ?? "20"),
      answerMode: params.get("answerMode") ?? "Word",
      types: parseInt(
        params.get("types") ??
          getBitwiseForTypes(DEFAULT_PROPS.settings.questionTypes).toString(),
      ),
      starred: params.get("starred") === "true",
    });

    const types = getQuestionTypesFromBitwise(settings.types);
    return {
      settings: {
        questionCount: settings.count,
        questionTypes:
          types.length > 0 ? types : DEFAULT_PROPS.settings.questionTypes,
        answerMode: settings.answerMode,
        studyStarred: settings.starred,
      },
      valid: true,
    };
  } catch {
    return {
      settings: DEFAULT_PROPS.settings,
      valid: false,
    };
  }
};

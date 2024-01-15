import { EnabledFeature } from "@quenti/lib/feature";

import { loadHandler } from "../../lib/load-handler";
import {
  createTRPCRouter,
  lockedProcedure,
  protectedProcedure,
} from "../../trpc";
import { ZBeginReviewSchema } from "./begin-review.schema";
import { ZCompleteCardsRoundSchema } from "./complete-cards-round.schema";
import { ZCompleteLearnRoundSchema } from "./complete-learn-round.schema";
import { ZResetCardsProgressSchema } from "./reset-cards-progress.schema";
import { ZResetLearnProgressSchema } from "./reset-learn-progress.schema";
import { ZSetAnswerModeSchema } from "./set-answer-mode.schema";
import { ZSetCardsAnswerWithSchema } from "./set-cards-answer-with.schema";
import { ZSetCardsStudyStarredSchema } from "./set-cards-study-starred.schema";
import { ZSetEnableCardsSortingSchema } from "./set-enable-cards-sorting.schema";
import { ZSetExtendedFeedbackBankSchema } from "./set-extended-feedback-bank.schema";
import { ZSetMatchStudyStarredSchema } from "./set-match-study-starred.schema";
import { ZSetMultipleAnswerModeSchema } from "./set-multiple-answer-mode.schema";
import { ZSetShuffleLearnSchema } from "./set-shuffle-learn.schema";
import { ZSetShuffleSchema } from "./set-shuffle.schema";
import { ZSetStudyStarredSchema } from "./set-study-starred.schema";
import { ZStarTermSchema } from "./star-term.schema";
import { ZUnstarTermSchema } from "./unstar-term.schema";

type ContainerRouterHandlerCache = {
  handlers: {
    ["set-shuffle"]?: typeof import("./set-shuffle.handler").setShuffleHandler;
    ["set-enable-cards-sorting"]?: typeof import("./set-enable-cards-sorting.handler").setEnableCardsSortingHandler;
    ["set-cards-study-starred"]?: typeof import("./set-cards-study-starred.handler").setCardsStudyStarredHandler;
    ["set-cards-answer-with"]?: typeof import("./set-cards-answer-with.handler").setCardsAnswerWithHandler;
    ["set-match-study-starred"]?: typeof import("./set-match-study-starred.handler").setMatchStudyStarredHandler;
    ["set-study-starred"]?: typeof import("./set-study-starred.handler").setStudyStarredHandler;
    ["set-answer-mode"]?: typeof import("./set-answer-mode.handler").setAnswerModeHandler;
    ["set-multiple-answer-mode"]?: typeof import("./set-multiple-answer-mode.handler").setMultipleAnswerModeHandler;
    ["set-shuffle-learn"]?: typeof import("./set-shuffle-learn.handler").setShuffleLearnHandler;
    ["set-extended-feedback-bank"]?: typeof import("./set-extended-feedback-bank.handler").setExtendedFeedbackBankHandler;
    ["star-term"]?: typeof import("./star-term.handler").starTermHandler;
    ["unstar-term"]?: typeof import("./unstar-term.handler").unstarTermHandler;
    ["complete-learn-round"]?: typeof import("./complete-learn-round.handler").completeLearnRoundHandler;
    ["complete-cards-round"]?: typeof import("./complete-cards-round.handler").completeCardsRoundHandler;
    ["reset-cards-progress"]?: typeof import("./reset-cards-progress.handler").resetCardsProgressHandler;
    ["reset-learn-progress"]?: typeof import("./reset-learn-progress.handler").resetLearnProgressHandler;
    ["begin-review"]?: typeof import("./begin-review.handler").beginReviewHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: ContainerRouterHandlerCache = {
  handlers: {},
  routerPath: "container",
};

export const containerRouter = createTRPCRouter({
  setShuffle: protectedProcedure
    .input(ZSetShuffleSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-shuffle");
      return HANDLER_CACHE.handlers["set-shuffle"]!({ ctx, input });
    }),
  setEnableCardsSorting: protectedProcedure
    .input(ZSetEnableCardsSortingSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-enable-cards-sorting");
      return HANDLER_CACHE.handlers["set-enable-cards-sorting"]!({
        ctx,
        input,
      });
    }),
  setCardsStudyStarred: protectedProcedure
    .input(ZSetCardsStudyStarredSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-cards-study-starred");
      return HANDLER_CACHE.handlers["set-cards-study-starred"]!({
        ctx,
        input,
      });
    }),
  setCardsAnswerWith: protectedProcedure
    .input(ZSetCardsAnswerWithSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-cards-answer-with");
      return HANDLER_CACHE.handlers["set-cards-answer-with"]!({
        ctx,
        input,
      });
    }),
  setMatchStudyStarred: protectedProcedure
    .input(ZSetMatchStudyStarredSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-match-study-starred");
      return HANDLER_CACHE.handlers["set-match-study-starred"]!({
        ctx,
        input,
      });
    }),
  setStudyStarred: protectedProcedure
    .input(ZSetStudyStarredSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-study-starred");
      return HANDLER_CACHE.handlers["set-study-starred"]!({ ctx, input });
    }),
  setAnswerMode: protectedProcedure
    .input(ZSetAnswerModeSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-answer-mode");
      return HANDLER_CACHE.handlers["set-answer-mode"]!({ ctx, input });
    }),
  setMultipleAnswerMode: protectedProcedure
    .input(ZSetMultipleAnswerModeSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-multiple-answer-mode");
      return HANDLER_CACHE.handlers["set-multiple-answer-mode"]!({
        ctx,
        input,
      });
    }),
  setShuffleLearn: protectedProcedure
    .input(ZSetShuffleLearnSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-shuffle-learn");
      return HANDLER_CACHE.handlers["set-shuffle-learn"]!({ ctx, input });
    }),
  setExtendedFeedbackBank: lockedProcedure([
    EnabledFeature.ExtendedFeedbackBank,
  ])
    .input(ZSetExtendedFeedbackBankSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-extended-feedback-bank");
      return HANDLER_CACHE.handlers["set-extended-feedback-bank"]!({
        ctx,
        input,
      });
    }),
  starTerm: protectedProcedure
    .input(ZStarTermSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "star-term");
      return HANDLER_CACHE.handlers["star-term"]!({ ctx, input });
    }),
  unstarTerm: protectedProcedure
    .input(ZUnstarTermSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "unstar-term");
      return HANDLER_CACHE.handlers["unstar-term"]!({ ctx, input });
    }),
  completeLearnRound: protectedProcedure
    .input(ZCompleteLearnRoundSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "complete-learn-round");
      return HANDLER_CACHE.handlers["complete-learn-round"]!({
        ctx,
        input,
      });
    }),
  completeCardsRound: protectedProcedure
    .input(ZCompleteCardsRoundSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "complete-cards-round");
      return HANDLER_CACHE.handlers["complete-cards-round"]!({
        ctx,
        input,
      });
    }),
  resetCardsProgress: protectedProcedure
    .input(ZResetCardsProgressSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "reset-cards-progress");
      return HANDLER_CACHE.handlers["reset-cards-progress"]!({
        ctx,
        input,
      });
    }),
  resetLearnProgress: protectedProcedure
    .input(ZResetLearnProgressSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "reset-learn-progress");
      return HANDLER_CACHE.handlers["reset-learn-progress"]!({
        ctx,
        input,
      });
    }),
  beginReview: protectedProcedure
    .input(ZBeginReviewSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "begin-review");
      return HANDLER_CACHE.handlers["begin-review"]!({ ctx, input });
    }),
});

import { motion } from "framer-motion";
import React from "react";

import { GenericLabel } from "@quenti/components";
import { cleanSpaces } from "@quenti/core/evaluator";
import { getRandom } from "@quenti/lib/array";

import { Stack } from "@chakra-ui/react";

import { useLearnContext } from "../../../../stores/use-learn-store";
import { AnswerCard } from "./answer-card";

export const CorrectState: React.FC<{ guess: string }> = ({ guess }) => {
  const feedbackBank = useLearnContext((s) => s.feedbackBank);

  const [remark] = React.useState(getRandom(feedbackBank.correct));

  return (
    <motion.div
      initial={{
        translateY: -16,
        opacity: 0.5,
      }}
      animate={{
        translateY: 0,
        opacity: 1,
      }}
    >
      <Stack spacing="2" pb="4">
        <GenericLabel evaluation>{remark}</GenericLabel>
        <AnswerCard text={cleanSpaces(guess)} correct />
      </Stack>
    </motion.div>
  );
};

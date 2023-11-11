import { useSession } from "next-auth/react";
import { log } from "next-axiom";
import React from "react";

import type { Question } from "@quenti/interfaces";

import { useAuthedSet } from "../../../hooks/use-set";
import { useLearnContext } from "../../../stores/use-learn-store";
import { word } from "../../../utils/terms";
import { CorrectState } from "./write/correct-state";
import { IncorrectState } from "./write/incorrect-state";
import { InputState } from "./write/input-state";
import { UnknownPartialState } from "./write/unknown-partial-state";

export interface WriteCardProps {
  active: Question;
}

export const WriteCard: React.FC<WriteCardProps> = ({ active }) => {
  const status = useLearnContext((s) => s.status);
  const session = useSession();
  const { container } = useAuthedSet();
  const [guess, setGuess] = React.useState<string | undefined>();

  const [start] = React.useState(Date.now());

  React.useEffect(() => {
    if (["correct", "incorrect"].includes(status as string)) {
      const elapsed = Date.now() - start;

      log.info(`learn.write.${status}`, {
        userId: session.data?.user?.id,
        containerId: container.id,
        termId: active.term.id,
        guess,
        answer: word(active.answerMode, active.term, "answer"),
        skipped: !guess,
        elapsed,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, active.term.id]);

  if (status === "correct") return <CorrectState guess={guess || ""} />;
  if (status === "incorrect")
    return <IncorrectState active={active} guess={guess} />;
  if (status === "unknownPartial")
    return <UnknownPartialState active={active} guess={guess} />;

  return <InputState active={active} onSubmit={setGuess} />;
};

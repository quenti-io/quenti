import React from "react";
import type { Question } from "../../../interfaces/question";
import { useLearnContext } from "../../../stores/use-learn-store";
import { CorrectState } from "./write/correct-state";
import { IncorrectState } from "./write/incorrect-state";
import { InputState } from "./write/input-state";
import { UnknownPartialState } from "./write/unknown-partial-state";

export interface WriteCardProps {
  active: Question;
}

export const WriteCard: React.FC<WriteCardProps> = ({ active }) => {
  const status = useLearnContext((s) => s.status);
  const [guess, setGuess] = React.useState<string | undefined>();

  if (status === "correct") return <CorrectState guess={guess || ""} />;
  if (status === "incorrect")
    return <IncorrectState active={active} guess={guess} />;
  if (status === "unknownPartial")
    return <UnknownPartialState active={active} guess={guess} />;

  return <InputState active={active} onSubmit={setGuess} />;
};

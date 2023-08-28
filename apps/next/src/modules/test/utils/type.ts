import { TestQuestionType } from "@quenti/interfaces";

import { IconPencil } from "@tabler/icons-react";
import {
  IconLayersSubtract,
  IconLayoutGrid,
  IconToggleRight,
  type TablerIconsProps,
} from "@tabler/icons-react";

export const getQuestionTypeName = (type: TestQuestionType) => {
  switch (type) {
    case TestQuestionType.TrueFalse:
      return "True / false";
    case TestQuestionType.MultipleChoice:
      return "Multiple choice";
    case TestQuestionType.Match:
      return "Match";
    case TestQuestionType.Write:
      return "Write";
  }
};

export const getQuestionTypeIcon = (
  type: TestQuestionType,
): React.FC<TablerIconsProps> => {
  switch (type) {
    case TestQuestionType.TrueFalse:
      return IconToggleRight;
    case TestQuestionType.MultipleChoice:
      return IconLayoutGrid;
    case TestQuestionType.Match:
      return IconLayersSubtract;
    case TestQuestionType.Write:
      return IconPencil;
  }
};

export const getBitwiseForTypes = (types: TestQuestionType[]) => {
  // Get the bitwise value for the types
  let type = 0;
  for (const t of types) {
    type |= 1 << Object.values(TestQuestionType).indexOf(t);
  }
  return type;
};

export const getQuestionTypesFromBitwise = (type: number) => {
  const types = [];
  for (const t of Object.values(TestQuestionType)) {
    if (type & (1 << Object.values(TestQuestionType).indexOf(t))) {
      types.push(t);
    }
  }
  return types;
};

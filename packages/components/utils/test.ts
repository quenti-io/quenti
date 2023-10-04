import { TestQuestionType } from "@quenti/interfaces";

import {
  IconLayersSubtract,
  IconLayoutGrid,
  IconPencil,
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
      return "Matching";
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

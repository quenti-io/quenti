import { cohere } from "../lib/cohere";
import CATEGORIES from "./categories";

const provided: { label: string; text: string }[] = [];
const coursesToCategories: Record<string, string> = {};

for (const category of Object.keys(CATEGORIES)) {
  const courses = CATEGORIES[category as keyof typeof CATEGORIES];
  for (const course in courses) {
    const examples = courses[course as keyof typeof courses]! as string[];
    for (const example of examples) {
      provided.push({ label: course, text: example });
    }
    coursesToCategories[course] = category;
  }
}

export interface Classification {
  course: string;
  category: string;
}

export const classifyClass = async (
  name: string,
): Promise<Classification | null> => {
  const response = await cohere.classify({
    examples: provided,
    inputs: [name],
  });

  if (!response.body.classifications.length) return null;
  const classification = response.body.classifications[0]!;

  const course = classification.prediction;
  const category = coursesToCategories[course]!;

  return { course, category };
};

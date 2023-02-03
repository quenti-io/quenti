import { relevantLabel } from "./time";

export const groupIntoTimeline = <T extends { createdAt: Date }>(
  data: T[]
): { label: string; items: T[] }[] => {
  const groups = new Array<{ label: string; items: T[] }>();

  for (const item of data.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )) {
    const label = relevantLabel(item.createdAt);
    const group = groups.find((group) => group.label === label);
    if (group) {
      group.items.push(item);
    } else {
      groups.push({ label, items: [item] });
    }
  }

  return groups;
};

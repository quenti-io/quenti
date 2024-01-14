import { relevantLabel } from "./time";

export const groupIntoTimeline = <K extends keyof T, T extends Record<K, Date>>(
  data: T[],
  key = "createdAt" as K,
): { label: string; items: T[] }[] => {
  const groups = new Array<{ label: string; items: T[] }>();

  for (const item of data.sort((a, b) => b[key].getTime() - a[key].getTime())) {
    const label = relevantLabel(item[key]);
    const group = groups.find((group) => group.label === label);
    if (group) {
      group.items.push(item);
    } else {
      groups.push({ label, items: [item] });
    }
  }

  return groups;
};

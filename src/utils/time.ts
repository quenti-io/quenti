import { plural } from "./string";

export const relevantLabel = (date: Date) => {
  const now = new Date();

  if (date.getFullYear() === now.getFullYear()) {
    if (date.getMonth() === now.getMonth()) {
      if (date.getDate() === now.getDate()) {
        return "Today";
      } else if (date.getDate() === now.getDate() - 1) {
        return "Yesterday";
      } else {
        const dayOfWeek = date.getDay();
        const dayOfWeekNow = now.getDay();
        const diff = Math.floor(dayOfWeekNow / 7) - Math.floor(dayOfWeek / 7);

        if (diff == 0) {
          return "This week";
        }
        return `${plural(diff, "week")} ago`;
      }
    } else {
      return date.toLocaleDateString("en-US", {
        month: "long",
      });
    }
  } else {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }
};

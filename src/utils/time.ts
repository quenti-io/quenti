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
        const diff = dayOfWeekNow - dayOfWeek;

        if (diff >= 0 && diff <= 6) {
          return `This week`;
        } else {
          const diff = Math.floor(dayOfWeekNow / 7) - Math.floor(dayOfWeek / 7);
          return `${diff} weeks ago`;
        }
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

export const relevantLabel = (date: Date) => {
  const now = new Date();

  if (date.getFullYear() === now.getFullYear()) {
    if (date.getMonth() === now.getMonth()) {
      if (date.getDate() === now.getDate()) {
        return "Today";
      } else if (date.getDate() === now.getDate() - 1) {
        return "Yesterday";
      } else {
        const diff = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) {
          return "This week";
        }
        if (diffDays <= 14) {
          return "Last week";
        }

        return "This month";
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

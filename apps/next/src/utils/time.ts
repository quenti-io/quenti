const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

export const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

// https://stackoverflow.com/a/53800501/9768266
export const getRelativeTime = (d1: Date, d2 = new Date()) => {
  const elapsed = d1.getTime() - d2.getTime();

  // "Math.abs" accounts for both "past" & "future" scenarios
  for (const u in units)
    if (Math.abs(elapsed) > units[u as keyof typeof units] || u == "second")
      return rtf
        .format(
          Math.round(elapsed / units[u as keyof typeof units]),
          u as Parameters<typeof rtf.format>[1],
        )
        .replace(/now/g, "just now")
        .replace(/^\d second[s]? ago$/, "just now")
        .replace(/^in.*$/, "just now");
};

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

export const dtFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const briefFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export const formatElapsedTime = (ms: number) => {
  const value = new Date(ms).toISOString().substring(11, 19);
  if (value.startsWith("00:")) {
    return value.substring(3);
  }
};

export const formatDeciseconds = (deciseconds: number) => {
  const seconds = Math.floor(deciseconds / 10);
  const deci = deciseconds % 10;

  return `${seconds}.${deci}`;
};

export const formatDueDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const today = new Date();
  const dateDifference = Math.floor(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  const isToday =
    new Date(date).setHours(0, 0, 0, 0) == new Date(today).setHours(0, 0, 0, 0);

  if (dateDifference < 0 && !isToday) {
    options.month = "short";
    options.day = "numeric";
    options.weekday = undefined;
  } else if (dateDifference >= 7) {
    options.weekday = undefined;
    options.month = "short";
    options.day = "numeric";
  }

  if (date.getFullYear() !== today.getFullYear()) {
    options.year = "numeric";
  }

  return new Intl.DateTimeFormat("en-US", options)
    .formatToParts(date)
    .map((part) => {
      switch (part.type) {
        case "hour":
          return ` at ${part.value}`;
        case "weekday":
          return isToday ? "Today" : part.value;
        case "literal":
          return part.value.replace(", ", "");
        case "year":
          return `, ${part.value}`;
        default:
          return part.value;
      }
    })
    .join("");
};

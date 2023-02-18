import Filter from "bad-words";

export const filter = new Filter();
// Some words are useful enough in historical contexts, others are just not that profane
filter.removeWords("hell", "hells", "nazi", "nazis", "crap", "fart");

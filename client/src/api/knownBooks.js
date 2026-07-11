export const KNOWN_BOOKS_METADATA = {
  "atomic habits": {
    publishedYear: 2018,
    publisher: "Avery",
    pages: 320,
    language: "English",
    sales: "20+ Million"
  },
  "the alchemist": {
    publishedYear: 1988,
    publisher: "HarperOne",
    pages: 163,
    language: "English",
    sales: "150+ Million"
  },
  "think and grow rich": {
    publishedYear: 1937,
    publisher: "Ralston",
    pages: 384,
    language: "English",
    sales: "15+ Million"
  },
  "rich dad poor dad": {
    publishedYear: 1997,
    publisher: "Warner Books",
    pages: 336,
    language: "English",
    sales: "40+ Million"
  },
  "ikigai": {
    publishedYear: 2016,
    publisher: "Penguin Books",
    pages: 208,
    language: "English",
    sales: "3+ Million"
  },
  "deep work": {
    publishedYear: 2016,
    publisher: "Grand Central Publishing",
    pages: 304,
    language: "English",
    sales: "2+ Million"
  },
  "the psychology of money": {
    publishedYear: 2020,
    publisher: "Harriman House",
    pages: 252,
    language: "English",
    sales: "4+ Million"
  },
  "clean code": {
    publishedYear: 2008,
    publisher: "Prentice Hall",
    pages: 464,
    language: "English"
  },
  "the pragmatic programmer": {
    publishedYear: 1999,
    publisher: "Addison-Wesley",
    pages: 352,
    language: "English"
  },
  "harry potter and the philosopher's stone": {
    publishedYear: 1997,
    publisher: "Bloomsbury",
    pages: 223,
    language: "English",
    sales: "120+ Million"
  },
  "to kill a mockingbird": {
    publishedYear: 1960,
    publisher: "J.B. Lippincott & Co.",
    pages: 281,
    language: "English",
    sales: "40+ Million"
  },
  "1984": {
    publishedYear: 1949,
    publisher: "Secker & Warburg",
    pages: 328,
    language: "English",
    sales: "30+ Million"
  },
  "sapiens": {
    publishedYear: 2011,
    publisher: "Harvill Secker",
    pages: 512,
    language: "English",
    sales: "25+ Million"
  },
  "wings of fire": {
    publishedYear: 1999,
    publisher: "Universities Press",
    pages: 180,
    language: "English"
  },
  "the intelligent investor": {
    publishedYear: 1949,
    publisher: "Harper & Brothers",
    pages: 640,
    language: "English"
  }
};

export const getKnownMetadata = (title) => {
  if (!title) return null;
  return KNOWN_BOOKS_METADATA[title.toLowerCase().trim()];
};

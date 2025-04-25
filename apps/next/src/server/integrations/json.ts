export function parseJson(text: string) {
    const arr = JSON.parse(text);
    if (!Array.isArray(arr)) throw new Error("JSON deve ser um array.");
    return arr
      .filter((i): i is any => i.term && i.definition)
      .map(i => ({ term: i.term, definition: i.definition }));
  }
  
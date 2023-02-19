const supMap = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
};

const subMap = {
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
};

// Returns a string with <sub> and <sup> tags in place of super and subscripts
export const formatScripts = (
  text: string
): { value: string; super: boolean; sub: boolean }[] => {
  // Split the string by sub and super characters
  const split = text.split(
    /([₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹])|(?<=[₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹])/g
  );

  const arr = [];
  for (const s of split) {
    if (s in supMap) {
      arr.push({
        value: supMap[s as keyof typeof supMap],
        super: true,
        sub: false,
      });
    } else if (s in subMap) {
      arr.push({
        value: subMap[s as keyof typeof subMap],
        super: false,
        sub: true,
      });
    } else {
      arr.push({ value: s, super: false, sub: false });
    }
  }

  return arr;
};

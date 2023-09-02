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
  "⁻": "-",
  "⁺": "+",
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
  "₋": "-",
  "₊": "+",
};

// Returns a string with <sub> and <sup> tags in place of super and subscripts
export const formatScripts = (
  text: string,
): { value: string; super: boolean; sub: boolean }[] => {
  // Split the string by sub and super characters
  const split = text.split(/([₀₁₂₃₄₅₆₇₈₉₋₊⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺])/);

  let arr = [];
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

  // Remove empty strings
  arr = arr.filter((a) => !!a.value.length);

  // If multiple consecutive subscripts, combine them
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i]!.sub && arr[i + 1]!.sub) {
      arr[i]!.value += arr[i + 1]!.value;
      arr.splice(i + 1, 1);
    }
  }
  // If multiple consecutive superscripts, combine them
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i]!.super && arr[i + 1]!.super) {
      arr[i]!.value += arr[i + 1]!.value;
      arr.splice(i + 1, 1);
    }
  }

  return arr;
};

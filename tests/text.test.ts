import { formatScripts } from "../apps/next/src/utils/scripts";

describe("test script formatting", () => {
  test("string with no formatting should be unchanged", () => {
    expect(formatScripts("This is a test")).toStrictEqual([
      { value: "This is a test", super: false, sub: false },
    ]);
  });

  test("string with subscripts should be formatted", () => {
    expect(formatScripts("H₂O")).toStrictEqual([
      { value: "H", super: false, sub: false },
      { value: "2", super: false, sub: true },
      { value: "O", super: false, sub: false },
    ]);
  });

  test("string with multiple subscripts should be formatted", () => {
    expect(formatScripts("H₂O₂")).toStrictEqual([
      { value: "H", super: false, sub: false },
      { value: "2", super: false, sub: true },
      { value: "O", super: false, sub: false },
      { value: "2", super: false, sub: true },
    ]);
  });

  test("string with superscripts should be formatted", () => {
    expect(formatScripts("r²")).toStrictEqual([
      { value: "r", super: false, sub: false },
      { value: "2", super: true, sub: false },
    ]);
  });

  test("string with consecutive subscripts should be formatted", () => {
    expect(formatScripts("C₁₀")).toStrictEqual([
      { value: "C", super: false, sub: false },
      { value: "10", super: false, sub: true },
    ]);
  });

  test("string with consecutive superscripts should be formatted", () => {
    expect(formatScripts("r²²")).toStrictEqual([
      { value: "r", super: false, sub: false },
      { value: "22", super: true, sub: false },
    ]);
  });

  test("string with both superscripts and subscripts should be formatted", () => {
    expect(formatScripts("H₂O²")).toStrictEqual([
      { value: "H", super: false, sub: false },
      { value: "2", super: false, sub: true },
      { value: "O", super: false, sub: false },
      { value: "2", super: true, sub: false },
    ]);
  });

  test("string with multiple superscripts and subscripts should be formatted", () => {
    expect(formatScripts("H₂O²⁴₁₀²")).toStrictEqual([
      { value: "H", super: false, sub: false },
      { value: "2", super: false, sub: true },
      { value: "O", super: false, sub: false },
      { value: "24", super: true, sub: false },
      { value: "10", super: false, sub: true },
      { value: "2", super: true, sub: false },
    ]);

    expect(formatScripts("Cr₂O₇²⁻")).toStrictEqual([
      { value: "Cr", super: false, sub: false },
      { value: "2", super: false, sub: true },
      { value: "O", super: false, sub: false },
      { value: "7", super: false, sub: true },
      { value: "2-", super: true, sub: false },
    ]);
  });
});

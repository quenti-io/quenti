/** @type {import("prettier").Config} */
module.exports = {
  importOrder: [
    "^@quenti/(.*)$",
    "^@trpc/(.*)$",
    "^@chakra-ui/(.*)$",
    "^@tabler/icons-react$",
    "^~/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ["typescript", "jsx", "importAssertions"],
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
};

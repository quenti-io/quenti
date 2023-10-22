/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "turbo",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint", "unused-imports"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
    },
    {
      files: [
        "packages/trpc/**/*",
        "packages/payments/**/*",
        "packages/prisma/**/*",
        "scripts/**/*",
      ],
      rules: {
        "no-restricted-syntax": "off",
      },
    },
    {
      files: ["packages/**/*"],
      rules: {
        "@next/next/no-html-link-for-pages": "off",
      },
    },
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./apps/*/tsconfig.json", "./packages/*/tsconfig.json"],
  },
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
  },
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        disallowTypeAnnotations: false,
      },
    ],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-misused-promises": [
      2,
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    "no-restricted-syntax": [
      "error",
      {
        selector:
          "ImportDeclaration[importKind!='type'][source.value=/@quenti\\u002Fprisma\\u002Fclient/]",
        message:
          "Must use 'import type' when importing from @quenti/prisma/client. Database schemas are exposed to the client!",
      },
    ],
    "no-restricted-imports": [
      "warn",
      {
        paths: [
          {
            name: "@chakra-ui/react",
            importNames: ["Link"],
            message: "Use { Link } from @quenti/components instead.",
          },
        ],
      },
    ],
    "no-unused-vars": [
      "error",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
      },
    ],
    "unused-imports/no-unused-imports": "error",
  },
};

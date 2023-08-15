/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "turbo",
    "plugin:prettier/recommended",
  ],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
    },
    {
      files: [
        "src/server/**/*",
        "src/payments/**/*",
        "packages/prisma/**/*",
        "scripts/**/*",
        "prisma-seed.ts",
      ],
      rules: {
        "no-restricted-syntax": "off",
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
  plugins: ["@typescript-eslint", "unused-imports"],
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
          "ImportDeclaration[importKind!='type'][source.value=/@prisma\\u002Fclient/]",
        message:
          "Must use 'import type' when importing from @prisma/client. Database schemas are exposed to the client!",
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
    "@typescript-eslint/no-unused-vars": [
      "warn",
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

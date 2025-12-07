const js = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const importPlugin = require("eslint-plugin-import");
const unusedImportsPlugin = require("eslint-plugin-unused-imports");
const globals = require("globals");
const tseslint = require("typescript-eslint");

const config = defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    extends: ["js/recommended", importPlugin.flatConfigs.recommended],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: true,
    },
    plugins: { js },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  {
    files: ["**/*.{ts,mts,cts}"],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      importPlugin.flatConfigs.typescript,
    ],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      "unused-imports": unusedImportsPlugin,
    },
    rules: {
      "import/no-default-export": "error",
      "import/no-duplicates": "warn",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "object",
          ],
          pathGroups: [
            {
              group: "internal",
              pattern: "src/**",
            },
          ],
          distinctGroup: true,
          pathGroupsExcludedImportTypes: [],
          "newlines-between": "always",
          alphabetize: {
            caseInsensitive: true,
            order: "asc",
          },
          warnOnUnassignedImports: true,
        },
      ],
      "sort-imports": [
        "error",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
      "unused-imports/no-unused-imports": "error",
    },
  },
]);

module.exports = config;

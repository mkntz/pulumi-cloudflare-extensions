/** @type {import("lint-staged").Config} */
/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://github.com/okonet/lint-staged
 */
const config = {
  "package.json": ["npx sort-package-json"],
  "**/*.{js,ts}": ["eslint --fix", "prettier --write"],
  "**/*": ["prettier --write --ignore-unknown"],
};

module.exports = config;

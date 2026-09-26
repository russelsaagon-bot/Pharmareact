module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "no-undef": "error",
  },
};

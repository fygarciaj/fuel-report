const { rules } = require("eslint-config-prettier");

// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  ignorePatterns: ["/dist/*"],
  rules: {
    "prettier/prettier": ["error", { ...rules["prettier/prettier"] }],
    "react/prop-types": "off",
    "no-unused-vars": "warn",
    "no-console": "warn",
    "react/no-unstable-nested-components": ["warn"],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};

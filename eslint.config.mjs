import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

const nodeGlobals = {
  console: "readonly",
  process: "readonly",
  URL: "readonly",
  fetch: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
};

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      globals: nodeGlobals,
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: nodeGlobals,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: new URL(".", import.meta.url).pathname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  prettier,
);

import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "out/**",
      ".vscode/**",
      ".git/**",
      ".gitignore",
      ".eslintignore",
      ".eslintrc",
      ".prettierrc",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        projectService: true,
        noWarnOnMultipleProjects: true,
      },
      globals: {
        window: "readonly",
        document: "readonly",
        location: "readonly",
        history: "readonly",
        navigator: "readonly",
        console: "writable",
        localStorage: "writable",
        sessionStorage: "writable",
        setTimeout: "writable",
        clearTimeout: "writable",
        setInterval: "writable",
        clearInterval: "writable",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        React: "readonly",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project: ["./tsconfig.web.json", "./tsconfig.node.json"],
        },
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-explicit-any": "off",
      "no-global-assign": [
        "error",
        {
          exceptions: ["console", "localStorage", "sessionStorage"],
        },
      ],
      "import/no-unresolved": "error",
    },
  },
  {
    files: ["app/**/*.ts", "lib/**/*.ts", "app/**/*.tsx", "lib/**/*.tsx"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        window: "readonly",
      },
    },
  },
];

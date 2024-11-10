import baseConfig from "@repo/shared/eslint";
import pluginReact from "eslint-plugin-react";
import pluginHooks from "eslint-plugin-react-hooks";

export default [
  ...baseConfig,

  {
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  {
    plugins: {
      "react-hooks": pluginHooks,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      ...pluginHooks.configs.recommended.rules,
    },
  },
];

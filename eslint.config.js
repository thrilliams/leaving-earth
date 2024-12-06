import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ ignores: ["out/**/*"] },
	{ files: ["src/**/*.ts"] },
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			"@typescript-eslint/no-unused-expressions": [
				"error",
				{ allowTaggedTemplates: true },
			],
		},
	},
	eslintConfigPrettier,
];

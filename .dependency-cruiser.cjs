/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
	forbidden: [
		{
			name: "no-controller-in-state",
			severity: "error",
			comment:
				"A module in the State depends on code from the Controller. If there is code in the controller that the State needs to depend on, it should be moved or refactored.",
			from: { path: "^src[/]state" },
			to: { path: "^src[/]controller" },
		},

		{
			name: "no-circular",
			severity: "warn",
			comment:
				"This dependency is part of a circular relationship. You might want to revise your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ",
			from: {},
			to: {
				circular: true,
				viaOnly: {
					dependencyTypesNot: ["type-only"],
				},
			},
		},
		{
			name: "no-orphans",
			comment:
				"This is an orphan module - it's likely not used (anymore?). Either use it or remove it. If it's logical this module is an orphan (i.e. it's a config file), add an exception for it in your dependency-cruiser configuration. By default this rule does not scrutinize dot-files (e.g. .eslintrc.js), TypeScript declaration files (.d.ts), tsconfig.json and some of the babel and webpack configs.",
			severity: "warn",
			from: {
				orphan: true,
				pathNot: [
					"(^|/)[.][^/]+[.](?:js|cjs|mjs|ts|cts|mts|json)$", // dot files
					"[.]d[.]ts$", // TypeScript declaration files
					"(^|/)tsconfig[.]json$", // TypeScript config
					"(^|/)(?:babel|webpack)[.]config[.](?:js|cjs|mjs|ts|cts|mts|json)$", // other configs
				],
			},
			to: {},
		},
		{
			name: "not-to-test",
			comment:
				"This module depends on code within a folder that should only contain tests. As tests don't implement functionality this is odd. Either you're writing a test outside the test folder or there's something in the test folder that isn't a test.",
			severity: "error",
			from: {
				pathNot: "^(test)",
			},
			to: {
				path: "^(test)",
			},
		},
	],
	options: {
		doNotFollow: {
			path: ["node_modules"],
		},

		tsPreCompilationDeps: true,

		tsConfig: { fileName: "tsconfig.json" },

		enhancedResolveOptions: {
			exportsFields: ["exports"],
			conditionNames: ["import", "require", "node", "default", "types"],
			mainFields: ["module", "main", "types", "typings"],
		},
		reporterOptions: {
			dot: {
				collapsePattern: "node_modules/(?:@[^/]+/[^/]+|[^/]+)",
			},
			archi: {
				collapsePattern:
					"^(?:packages|src|lib(s?)|app(s?)|bin|test(s?)|spec(s?))/[^/]+|node_modules/(?:@[^/]+/[^/]+|[^/]+)",
			},
			text: {
				highlightFocused: true,
			},
		},
	},
};

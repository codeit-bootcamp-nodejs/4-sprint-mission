declare const _default: {
    plugins: {
        import: import("eslint").ESLint.Plugin & {
            meta: {
                name: string;
                version: string;
            };
            configs: {
                "recommended": import("eslint").Linter.LegacyConfig;
                "errors": import("eslint").Linter.LegacyConfig;
                "warnings": import("eslint").Linter.LegacyConfig;
                "stage-0": import("eslint").Linter.LegacyConfig;
                "react": import("eslint").Linter.LegacyConfig;
                "react-native": import("eslint").Linter.LegacyConfig;
                "electron": import("eslint").Linter.LegacyConfig;
                "typescript": import("eslint").Linter.LegacyConfig;
            };
            flatConfigs: {
                "recommended": import("eslint").Linter.FlatConfig;
                "errors": import("eslint").Linter.FlatConfig;
                "warnings": import("eslint").Linter.FlatConfig;
                "stage-0": import("eslint").Linter.FlatConfig;
                "react": import("eslint").Linter.FlatConfig;
                "react-native": import("eslint").Linter.FlatConfig;
                "electron": import("eslint").Linter.FlatConfig;
                "typescript": import("eslint").Linter.FlatConfig;
            };
            rules: {
                [key: string]: import("eslint").Rule.RuleModule;
            };
        };
    };
    rules: {
        "import/extensions": (string | {
            js: string;
            jsx: string;
            ts: string;
            tsx: string;
        })[];
    };
}[];
export default _default;
//# sourceMappingURL=eslint.config.d.ts.map
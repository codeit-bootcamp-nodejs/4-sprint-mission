// eslint.config.js
import js from "@eslint/js";
import pluginImport from "eslint-plugin-import";
export default [
    {
        plugins: {
            import: pluginImport,
        },
        rules: {
            "import/extensions": [
                "error",
                "always",
                {
                    js: "always",
                    jsx: "always",
                    ts: "always",
                    tsx: "always",
                },
            ],
        },
    },
];
//# sourceMappingURL=eslint.config.js.map
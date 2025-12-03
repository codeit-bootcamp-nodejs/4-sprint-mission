"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint.config.js
const js_1 = __importDefault(require("@eslint/js"));
const eslint_plugin_import_1 = __importDefault(require("eslint-plugin-import"));
exports.default = [
    {
        plugins: {
            import: eslint_plugin_import_1.default,
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
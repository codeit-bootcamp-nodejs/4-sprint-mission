"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const constants_1 = require("./lib/constants");
app_1.server.listen(constants_1.PORT, () => {
    console.log(`Server is running on http://localhost:${constants_1.PORT}`);
});
//# sourceMappingURL=server.js.map
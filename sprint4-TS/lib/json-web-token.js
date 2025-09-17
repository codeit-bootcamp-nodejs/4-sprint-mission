"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonWebToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var constants_js_1 = require("./constants.js");
var jsonWebToken = /** @class */ (function () {
    function jsonWebToken() {
        /*
        payload = {
          userId: Int
        }
        */
        this.generateAccess = function (user) {
            var SecretKey = constants_js_1.ACCESS_SECRET_KEY;
            var payload = {
                userId: user.id
            };
            var accesToken = jsonwebtoken_1.default.sign(payload, SecretKey, { expiresIn: '10h' });
            console.log("at json-web-token.js, acceessToken: ", accesToken);
            return accesToken;
        };
        this.generateRefresh = function (payload) {
            var SecretKey = constants_js_1.REFRESH_SECRET_KEY;
            var refreshToken = jsonwebtoken_1.default.sign(payload.userId, SecretKey, { expiresIn: '1d' });
            return refreshToken;
        };
        this.verify = function (token, SecretKey) {
            var decoded = jsonwebtoken_1.default.verify(token, SecretKey);
            return decoded;
        };
    }
    return jsonWebToken;
}());
exports.jsonWebToken = jsonWebToken;
exports.default = new jsonWebToken();

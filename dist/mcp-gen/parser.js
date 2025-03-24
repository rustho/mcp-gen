"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSwagger = parseSwagger;
const swagger_parser_1 = __importDefault(require("@apidevtools/swagger-parser"));
async function parseSwagger(filePath) {
    const api = await swagger_parser_1.default.dereference(filePath);
    return api;
}
//# sourceMappingURL=parser.js.map
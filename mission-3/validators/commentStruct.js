import { defaulted, size, object, string, optional } from "superstruct";
import { validAndParsingInteger } from "./struct.js";

export const getCommentList = object({
    cursorId: defaulted(optional(validAndParsingInteger(null)), null),
    page: defaulted(validAndParsingInteger(0), 0),
    nums: defaulted(validAndParsingInteger(10), 10),
})

export const commentValidator = object({
    content: size(string(), 1, 100),
})

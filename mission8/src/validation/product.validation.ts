import {z} from "zod"

export const paramsSchema = z.object({
    id : z.coerce.number().positive()
})

export const querySchema = z.object({
    page:z.coerce.number().positive().default(1),
    take:z.coerce.number().positive().default(10),
    type: z.enum(["unread","isRead"])
})

export const bodySchema = z.object({
    content: z.string(),
    type: z.enum(["unread","isRead"])
})
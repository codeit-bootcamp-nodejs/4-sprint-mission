    import {z} from "zod"

    export const paramsSchema = z.object({
        id : z.coerce.number().positive()
    })

    export const querySchema = z.object({
        page:z.coerce.number().positive().default(1),
        take:z.coerce.number().positive().default(10),
        type: z.enum(["UNREAD","IS_READ"]),
        category:z.enum(["NEW_COMMENT","NEW_LIKE","CHANGED_PRICE"])
    })

    export const bodySchema = z.object({
        content: z.string(),
        type: z.enum(["UNREAD","IS_READ"]),
        category:z.enum(["NEW_COMMENT","NEW_LIKE","CHANGED_PRICE"])
    })


    
    
    
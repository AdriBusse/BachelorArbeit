import { redis } from "../../redis"
import { v4 } from "uuid"
import { confirmUserPrefix } from "../constants/redisPrefixes"
export const createConfirmationURL = async (userId: number) => {
    const token = v4()
    await redis.set(confirmUserPrefix + token, userId, "ex", 60 * 60 * 24) // 1 day experation

    //redirect to a frontend page which will fire the mutation
    return `http://localhost:3000/user/confirm/${token}`
}
import { Arg, Mutation, Resolver } from "type-graphql";
import User from "../../entity/User"
import { redis } from "../../redis";
import { confirmUserPrefix } from "../constants/redisPrefixes";

declare module 'express-session' {
    interface Session {
        userId: any;
    }
}
@Resolver(User)
export class ConfirmUserResolver {

    @Mutation(() => Boolean)
    async confirmUser(
        @Arg("token") token: string,
    ): Promise<Boolean> {

        const userId = await redis.get(confirmUserPrefix + token)
        if (!userId) {
            return false
        }
        await User.update({ id: parseInt(userId, 10) }, { confirmed: true })
        await redis.del(token)
        return true;
    }
}

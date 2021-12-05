import { Arg, Mutation, Resolver } from "type-graphql";
import { v4 } from "uuid";
import User from "../../entity/User"
import { redis } from "../../redis";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";
import { sendMail } from "../utils/sendEmail";


@Resolver(User)
export class ForgetPasswordResolver {

    @Mutation(() => Boolean)
    async forgetPassword(
        @Arg("email") email: string,
    ): Promise<Boolean> {

        const user = await User.findOne({ where: { email } })

        if (!user) {
            return true
        }

        const token = v4()
        await redis.set(forgotPasswordPrefix + token, user.id, "ex", 60 * 60 * 24) // 1 day experation

        //redirect to a frontend page which will fire the mutation
        await sendMail(email, `http://localhost:3000/user/changePassword/${token}`)

        return true;
    }
}

import { Arg, Query, Resolver } from "type-graphql";
import User from "../../entity/User";

@Resolver(User)
export class GetUserResolver {
    @Query(() => User)
    async getUser(
        @Arg("username") username: string,
    ) {

        try {

            const user = await User.findOneOrFail({
                where: { username: username },
            });

            return user
        } catch (error) {
            console.log(error);
            throw new Error(error.message)

        }
    }
}
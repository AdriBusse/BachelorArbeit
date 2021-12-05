import { MyContext } from '../../types/MyContext';
import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Post } from "../../entity/Post";
import { Sub } from "../../entity/Sub";

@Resolver()
export class GetSubResolver {
    @Query(() => Sub)
    async getSub(
        @Arg("name") name: string,
        @Ctx() ctx: MyContext
    ): Promise<Sub> {
        try {
            const sub = await Sub.findOneOrFail({ where: { name }, relations: ['user'] });
            const posts = await Post.find({
                where: { sub },
                order: { createdAt: 'DESC' },

            });
            sub.posts = posts;
            if (ctx.res.locals.user) {
                sub.posts.forEach((p) => p.setUserVote(ctx.res.locals.user));
            }
            return sub
        } catch (error) {
            console.log(error);
            throw new Error(error.message)

        }
    }
}
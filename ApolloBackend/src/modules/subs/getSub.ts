import { MyContext } from '../../types/MyContext';
import { Arg, Ctx, Info, Query, Resolver } from "type-graphql";
import { Post } from "../../entity/Post";
import { Sub } from "../../entity/Sub";
import { GraphQLResolveInfo } from 'graphql';

@Resolver()
export class GetSubResolver {
    @Query(() => Sub)
    async getSub(
        @Arg("name") name: string,
        @Ctx() ctx: MyContext,
        @Info() info: GraphQLResolveInfo
    ): Promise<Sub> {
        console.log("INFOR____________", info);
        info.cacheControl.setCacheHint({ maxAge: 300 });

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
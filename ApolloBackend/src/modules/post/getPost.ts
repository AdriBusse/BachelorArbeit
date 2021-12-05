import { MyContext } from '../../types/MyContext';
import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Post } from "../../entity/Post";

@Resolver()
export class GetPostResolver {
    @Query(() => Post)
    async getPost(
        @Arg("identifier") identifier: string,
        @Arg("slug") slug: string,
        @Ctx() ctx: MyContext
    ): Promise<Post> {
        try {
            const post = await Post.findOneOrFail(
                { identifier, slug },
                { relations: ['sub', 'comments', 'votes', "user", "comments.user"] }
                //Order maybe
            );

            if (ctx.res.locals.user) {
                post.setUserVote(ctx.res.locals.user);
            }

            return post

        } catch (error) {
            console.log(error);
            throw new Error(error.message)

        }
    }
}
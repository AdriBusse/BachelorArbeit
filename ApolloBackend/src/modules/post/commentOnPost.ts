import { isAuth } from './../middleware/isAuth';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from '../../types/MyContext';
import { Post } from '../../entity/Post';
import Comment from '../../entity/Comment';

@Resolver(Post)
export class CommentOnPostResolver {
    @Mutation(() => Comment, { nullable: true })
    @UseMiddleware(isAuth)
    async commentOnPost(
        @Arg("identifier") identifier: string,
        @Arg("slug") slug: string,
        @Arg("body") body: string,
        @Ctx() ctx: MyContext
    ): Promise<Comment> {
        const user = ctx.res.locals.user
        try {
            const post = await Post.findOneOrFail({ identifier, slug });

            const comment = new Comment({ body, user, post });

            await comment.save();

            const fetchedComment = Comment.findOneOrFail({ where: { id: comment.id }, relations: ["user", "post", "votes"] })
            if (!fetchedComment) {
                throw new Error("sth went wrong")
            }
            return fetchedComment


        } catch (error) {
            console.log(error);
            throw new Error(error.message)
        }
    }
}
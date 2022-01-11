import { isPostOwner } from './../middleware/isPostOwner';
import { isAuth } from './../middleware/isAuth';
import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Post } from '../../entity/Post';

@Resolver(Post)
export class DeletePostResolver {
    @Mutation(() => Boolean, { nullable: true })
    @UseMiddleware(isAuth, isPostOwner)
    async deletePost(
        @Arg("identifier") identifier: string,
    ): Promise<Boolean> {
        try {

            const post = await Post.findOne({ where: { identifier } })

            if (!post) { throw new Error("Post not found") }
            await post?.remove()


            return true;

        } catch (error) {
            console.log(error);
            throw new Error(error.message)
        }
    }
}
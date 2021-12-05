import { Arg, Query, Resolver } from "type-graphql";
import { Post } from '../../entity/Post';

@Resolver(Post)
export class GetPostsResolver {
    @Query(() => [Post])
    async getPosts(
        @Arg("currentPage", { defaultValue: 0 }) currentPage: number,
        @Arg("postsPerPage", { defaultValue: 8 }) postsPerPage: number,
    ) {

        try {
            const posts = await Post.find({
                order: { createdAt: 'DESC' },
                skip: currentPage * postsPerPage,
                take: postsPerPage,
                relations: ['sub', 'comments', 'votes', "user", "comments.user"]


            });
            return posts
        } catch (error) {
            console.log(error);
            throw new Error(error.message)

        }
    }
}
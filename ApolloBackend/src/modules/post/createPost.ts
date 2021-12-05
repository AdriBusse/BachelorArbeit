import { isEmpty } from 'class-validator';
import { isAuth } from './../middleware/isAuth';
import { Sub } from './../../entity/Sub';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from '../../types/MyContext';
import { Post } from '../../entity/Post';

@Resolver(Post)
export class CreatePostResolver {
    @Mutation(() => Post, { nullable: true })
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("body") body: string,
        @Arg("title") title: string,
        @Arg("sub") sub: string, //name of sub
        @Ctx() ctx: MyContext
    ): Promise<Post> {
        const user = ctx.res.locals.user
        try {


            let errors: any = {};
            if (isEmpty(title)) errors.title = 'title should not be empty'
            if (isEmpty(body)) errors.body = 'name should not be empty'
            if (isEmpty(sub)) errors.sub = 'describtion should not be empty'

            if (title.trim() === '') {
                throw new Error('Title should not be empty')
            }

            const subRecord = await Sub.findOneOrFail({ name: sub });

            const post = new Post({ title, body, user, sub: subRecord });

            await post.save();
            const fetchedPost = Post.findOneOrFail({ where: { id: post.id }, relations: ["user", "votes", "comments", "sub"] })

            return fetchedPost

        } catch (error) {
            console.log(error);
            throw new Error(error.message)
        }
    }
}
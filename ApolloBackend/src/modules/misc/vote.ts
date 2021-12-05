import { isAuth } from './../middleware/isAuth';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from '../../types/MyContext';
import { Post } from '../../entity/Post';
import Comment from '../../entity/Comment';
import Vote from '../../entity/Vote';

@Resolver(Vote)
export class VoteResolver {
    @Mutation(() => Post, { nullable: true })
    @UseMiddleware(isAuth)
    async vote(
        @Arg("identifier") identifier: string,
        @Arg("slug") slug: string,
        @Arg("commentIdentifier", { nullable: true }) commentIdentifier: string,
        @Arg("value") value: number,
        @Ctx() ctx: MyContext
    ): Promise<Post> {

        //Validate
        if (![-1, 0, 1].includes(value)) {
            throw new Error('vALUE MUST BE -1, 0, 1')
        }

        try {
            const user = ctx.res.locals.user
            let post = await Post.findOneOrFail({ identifier, slug });

            let vote: Vote | undefined;
            let comment: Comment | undefined;

            if (commentIdentifier) {
                comment = await Comment.findOneOrFail({
                    identifier: commentIdentifier,
                });
                vote = await Vote.findOne({ user, comment });
            } else {
                vote = await Vote.findOne({ user, post });
            }

            if (!vote && value === 0) {
                //if no vote and value= 0 return error
                throw new Error('Vote not found')
            } else if (!vote) {
                //es wurde noch nicht abgestimmt für den Post/Kommentar
                vote = new Vote({ user, value });
                if (comment) vote.comment = comment;
                else vote.post = post;
                await vote.save();
            } else if (value === 0) {
                //if vote exist and value is 0 remove vote from Db
                await vote.remove();
            } else if (vote.value !== value) {
                //if vote exist already and value is different, update it
                vote.value = value;
                await vote.save();
            }
            //console.log(`search post with ${slug} and ${identifier}`);

            post = await Post.findOneOrFail(
                {
                    where: { identifier, slug },
                    relations: ['sub', 'comments', 'votes', "user", "comments.user"]
                }
            );

            if (!post) {
                throw new Error("sth went wrong")
            }
            await post.setUserVote(user);
            await post.comments?.forEach((c) => c.setUserVote(user));
            return post
        } catch (error) {
            console.log(error);
            throw new Error('sth went wrong')
        }

    }
}
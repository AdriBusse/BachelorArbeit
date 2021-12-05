import { Ctx, FieldResolver, Resolver, ResolverInterface, Root } from 'type-graphql';
import { Post } from '../../entity/Post';
import User from '../../entity/User';
import Vote from '../../entity/Vote';
import Comment from '../../entity/Comment';
import { MyContext } from '../../types/MyContext';

@Resolver(() => Vote)
export class VoteClassResolver implements ResolverInterface<Vote>{


    @FieldResolver()
    async user(@Root() vote: Vote): Promise<User> {
        const user = await User.findOneOrFail({ where: { username: vote.username } })
        return user
    }

    @FieldResolver()
    async post(@Root() vote: Vote, @Ctx() ctx: MyContext): Promise<Post> {
        const post = await Post.findOneOrFail({ where: { identifier: vote.post.identifier } })
        if (ctx.res.locals.user) {
            post.setUserVote(ctx.res.locals.user);
        }
        return post
    }

    @FieldResolver()
    async comment(@Root() vote: Vote, @Ctx() ctx: MyContext): Promise<Comment | null> {
        if (vote.comment) {
            const comment = await Comment.findOneOrFail({ where: { identifier: vote.comment?.identifier } })
            if (ctx.res.locals.user) {
                comment.setUserVote(ctx.res.locals.user);
            }
            return comment
        }
        return null

    }

}
















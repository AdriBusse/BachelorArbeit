import { Ctx, FieldResolver, Resolver, ResolverInterface, Root } from 'type-graphql';
import { Post } from '../../entity/Post';
import User from '../../entity/User';
import Vote from '../../entity/Vote';
import Comment from '../../entity/Comment';
import { MyContext } from '../../types/MyContext';

@Resolver(() => Comment)
export class CommentResolver implements ResolverInterface<Comment>{


    @FieldResolver()
    async user(@Root() comment: Comment): Promise<User> {
        const user = await User.findOneOrFail({ where: { username: comment.username } })
        return user
    }

    @FieldResolver()
    async post(@Root() comment: Comment, @Ctx() ctx: MyContext): Promise<Post> {
        const post = await Post.findOneOrFail({
            where: { username: comment.username }, relations: ["votes", "user"]
        })
        if (ctx.res.locals.user) {
            post.setUserVote(ctx.res.locals.user);
        }
        return post
    }

    @FieldResolver()
    async votes(@Root() comment: Comment): Promise<Vote[]> {
        const votes = await Vote.find({ where: { comment } })
        return votes
    }
    @FieldResolver()
    async userVote(@Root() comment: Comment, @Ctx() ctx: MyContext): Promise<Number> {
        if (ctx.res.locals.user) {
            const index = comment.votes?.findIndex((v) => v.username === ctx.res.locals.user.username)
            return index > -1 ? comment.votes[index].value : 0
        } else {
            return 0
        }
    }
    @FieldResolver()
    async voteScore(@Root() comment: Comment): Promise<number> {
        if (comment.votes != undefined) {
            return comment.votes.reduce((prev, curr) => prev + (curr.value || 0), 0);
        } else {
            return 0;
        }
    }

}
















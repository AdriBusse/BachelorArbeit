import { Sub } from './../../entity/Sub';
import { Ctx, FieldResolver, Resolver, ResolverInterface, Root } from 'type-graphql';
import { Post } from '../../entity/Post';
import User from '../../entity/User';
import Vote from '../../entity/Vote';
import Comment from '../../entity/Comment';
import { MyContext } from '../../types/MyContext';

@Resolver(() => Post)
export class PostResolver implements ResolverInterface<Post>{


    @FieldResolver()
    async user(@Root() post: Post): Promise<User> {
        const user = await User.findOneOrFail({ where: { username: post.username } })
        return user
    }

    @FieldResolver()
    async sub(@Root() post: Post): Promise<Sub> {

        const sub = await Sub.findOneOrFail({ where: { name: post.subName } })

        return sub
    }

    @FieldResolver()
    async comments(@Root() post: Post, @Ctx() ctx: MyContext): Promise<Comment[]> {
        const comments = await Comment.find({ where: { post }, relations: ["votes", "user"] })
        if (ctx.res.locals.user) {
            comments.forEach((c) => {
                c.setUserVote(ctx.res.locals.user);
            })
        }
        return comments
    }

    @FieldResolver()
    async votes(@Root() post: Post): Promise<Vote[]> {
        const votes = await Vote.find({ where: { post } })
        return votes
    }

    @FieldResolver()
    async userVote(@Root() post: Post, @Ctx() ctx: MyContext): Promise<Number> {
        if (ctx.res.locals.user) {
            const index = post.votes?.findIndex((v) => v.username === ctx.res.locals.user.username)
            return index > -1 ? post.votes[index].value : 0
        } else {
            return 0
        }
    }

    @FieldResolver()
    async voteScore(@Root() post: Post): Promise<number> {
        if (post.votes != undefined) {
            return post.votes.reduce((prev, curr) => prev + (curr.value || 0), 0);
        } else {
            return 0;
        }
    }

}
















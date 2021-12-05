import { MyContext } from './../../types/MyContext';
import { Ctx, FieldResolver, Resolver, ResolverInterface, Root } from 'type-graphql';
import { Post } from '../../entity/Post';
import User from '../../entity/User';
import Vote from '../../entity/Vote';
import Comment from '../../entity/Comment';
import { Sub } from '../../entity/Sub';

@Resolver(() => User)
export class UserResolver implements ResolverInterface<User>{


    @FieldResolver()
    async votes(@Root() user: User): Promise<Vote[]> {
        const votes = await Vote.find({ where: { user } })
        return votes
    }

    @FieldResolver()
    async posts(@Root() user: User, @Ctx() ctx: MyContext
    ): Promise<Post[]> {
        const posts = await Post.find({ where: { user } })
        if (ctx.res.locals.user) {
            posts.forEach((p) => {
                p.setUserVote(ctx.res.locals.user);
            })
        }
        return posts
    }

    @FieldResolver()
    async comments(@Root() user: User, @Ctx() ctx: MyContext
    ): Promise<Comment[]> {
        const comments = await Comment.find({ where: { user } })
        if (ctx.res.locals.user) {
            comments.forEach((c) => {
                c.setUserVote(ctx.res.locals.user);
            })
        }
        return comments
    }

    @FieldResolver()
    async userSubmissions(@Root() user: User, @Ctx() ctx: MyContext): Promise<any[]> {

        console.log(user);

        const posts = await Post.find({
            where: { user }, relations: ["sub", "comments", "user"]
        });

        const comments = await Comment.find({
            where: { user }, relations: ["user", "post", "votes", "post.user", "post.comments"]
        });

        if (ctx.res.locals.user) {
            posts.forEach((p) => p.setUserVote(ctx.res.locals.user));
            comments.forEach((c) => c.setUserVote(ctx.res.locals.user));
        }

        let submissions: any[] = [];
        posts.forEach((p) => submissions.push(p))
        comments.forEach((c) =>
            submissions.push(c)
        );

        submissions.sort((a, b) => {
            if (b.createdAt > a.createdAt) return 1;
            if (b.createdAt < a.createdAt) return -1;
            return 0;
        });

        return submissions

    }

    @FieldResolver()
    async followedSubs(@Root() user: User): Promise<Sub[]> {
        console.log("_____________________________________________");

        const u = await User.findOneOrFail({ where: { username: user.username }, relations: ["followedSubs"] })
        console.log(u);

        return u.followedSubs
    }
}
















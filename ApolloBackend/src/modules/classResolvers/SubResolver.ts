import { Sub } from './../../entity/Sub';
import { Ctx, FieldResolver, Resolver, ResolverInterface, Root } from 'type-graphql';
import { Post } from '../../entity/Post';
import User from '../../entity/User';
import { MyContext } from '../../types/MyContext';
import { getConnection } from 'typeorm';


@Resolver(() => Sub)
export class SubResolver implements ResolverInterface<Sub>{


    @FieldResolver()
    async user(@Root() sub: Sub): Promise<User> {
        const user = await User.findOneOrFail({ where: { username: sub.username }, relations: ["votes", "user", "comments"] })
        return user
    }

    @FieldResolver()
    async posts(@Root() sub: Sub, @Ctx() ctx: MyContext): Promise<Post[]> {
        const posts = await Post.find({ where: { sub }, relations: ["votes", "user", "comments"] })
        if (ctx.res.locals.user) {
            posts.forEach((p) => {
                p.setUserVote(ctx.res.locals.user);
            })
        }

        return posts
    }

    @FieldResolver()
    async imageUrl(@Root() sub: Sub): Promise<string> {
        return sub.imageUrn
            ? `${process.env.APP_URL}/images/subs/image/${sub.imageUrn}`
            : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
    }




    @FieldResolver()
    async bannerUrl(@Root() sub: Sub): Promise<string | null> {
        return sub.bannerUrn
            ? `${process.env.APP_URL}/images/subs/banner/${sub.bannerUrn}`
            : null;
    }

    @FieldResolver()
    async postCount(@Root() sub: Sub): Promise<number> {
        const pCount = await getConnection().createQueryBuilder()
            .from(Post, "post")
            .where("post.subName = :name", { name: sub.name }).getCount();
        return pCount
    }

    @FieldResolver()
    async followerCount(@Root() sub: Sub): Promise<number> {
        const fCount = await Sub.findOne({ where: { id: sub.id }, relations: ["follower"], cache: 3000 })
        return fCount!.follower.length | 0
    }

    @FieldResolver()
    async follower(@Root() sub: Sub): Promise<User[]> {

        const s = await Sub.findOneOrFail({ where: { id: sub.id }, relations: ["follower"], cache: 3000 })
        return s.follower
    }

    @FieldResolver()
    async userFollows(@Root() sub: Sub, @Ctx() ctx: MyContext): Promise<Number> {
        const s = await Sub.findOneOrFail({ where: { id: sub.id }, relations: ["follower"], cache: 3000 })
        if (ctx.res.locals.user) {
            const index = s.follower.findIndex((f) => f.username === ctx.res.locals.user.username)
            return index > -1 ? 1 : 0
        } else {
            return 0
        }
    }




}








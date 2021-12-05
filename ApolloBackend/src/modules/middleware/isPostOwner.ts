import { MyContext } from "../../types/MyContext";
import { MiddlewareFn } from "type-graphql";
import User from "../../entity/User";
import { Post } from "../../entity/Post";

export const isPostOwner: MiddlewareFn<MyContext> = async ({ context, args }, next) => {
    try {
        const user: User | undefined = context.res.locals.user;
        console.log("____________in isPostOwner____________");
        console.log(user);

        if (!user) throw new Error('Unauthenticated');

        const post = await Post.findOne({ where: { identifier: args.identifier } });
        console.log(post);

        console.log(post?.username, " and ", user!.username);

        if (post?.username !== user!.username) throw new Error('Not authorized');

        return next();
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }

};
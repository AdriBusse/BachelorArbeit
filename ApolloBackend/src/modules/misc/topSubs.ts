import { Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from '../../entity/Post';
import { Sub } from "../../entity/Sub";
import Comment from "../../entity/Comment";

@Resolver(Sub)
export class topSubsResolver {
    @Query(() => [Sub])
    async topSubs() {

        try {
            const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/subs/image/' || s."imageUrn",'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`;
            //fetch Subs with top posts
            const subs = await getConnection()
                .createQueryBuilder()
                .select(
                    `s.title, s.name, s.id, s.imageUrn as imageUrn, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
                )
                .from(Sub, 's')
                .leftJoin(Post, 'p', `s.name = p."subName"`)
                .groupBy('s.title, s.name, s.id, "imageUrl", "imageUrn"')
                .orderBy(`"postCount"`, 'DESC')
                .limit(5)
                .execute();

            return subs
        } catch (error) {
            console.log(error);
            throw new Error(error.message)

        }
    }

    @Query(() => [Comment])
    async comments() {

        try {
            const comments = await Comment.find({})
            return comments
        } catch (error) {
            console.log(error);
            throw new Error(error.message)

        }
    }
}
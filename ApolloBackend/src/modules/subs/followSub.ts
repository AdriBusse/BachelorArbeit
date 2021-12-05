import { isEmpty } from 'class-validator';
import { isAuth } from './../middleware/isAuth';
import { Sub } from './../../entity/Sub';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from '../../types/MyContext';

@Resolver(Sub)
export class FollowSubResolver {
    @Mutation(() => Sub, { nullable: true })
    @UseMiddleware(isAuth)
    async followSub(
        @Arg("name") name: string,
        @Ctx() ctx: MyContext
    ): Promise<Sub> {
        const user = ctx.res.locals.user

        if (!user) {
            throw new Error('no user in Context')
        }

        try {

            let errors: any = {};
            if (isEmpty(name)) errors.name = 'name should not be empty'


            if (Object.keys(errors).length > 0) {
                console.log(errors);
                throw new Error(" Input should not be empty")
            }

            const existingSub = await Sub.findOneOrFail({ where: { name }, relations: ["follower"] })

            if (!existingSub) {
                throw new Error('Sub doesnt exists already')
            }
            existingSub.follower = [...existingSub.follower, user]
            await existingSub.save()

            // userDB.followedSubs = [...user.followedSubs, existingSub]
            // await userDB.save()

            return existingSub

        } catch (error) {
            console.log(error);
            throw new Error(error.message)
        }
    }
}
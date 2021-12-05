import { isEmpty } from 'class-validator';
import { isAuth } from './../middleware/isAuth';
import { Sub } from './../../entity/Sub';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from '../../types/MyContext';
import User from '../../entity/User';

@Resolver(Sub)
export class DefollowSubResolver {
    @Mutation(() => Sub, { nullable: true })
    @UseMiddleware(isAuth)
    async defollowSub(
        @Arg("name") name: string,
        @Ctx() ctx: MyContext
    ): Promise<Sub> {
        const user: User = ctx.res.locals.user

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
            console.log(existingSub);

            if (!existingSub) {
                throw new Error(' Sub doest exists already')
            }
            console.log('___________', existingSub.follower);

            existingSub.follower = existingSub.follower.filter((u) => {
                console.log('__________', u, '___________');

                return user.id !== u.id
            })

            await existingSub.save()

            return existingSub

        } catch (error) {
            console.log(error);
            throw new Error(error.message)
        }
    }
}
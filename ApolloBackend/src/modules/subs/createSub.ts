import { isEmpty } from 'class-validator';
import { isAuth } from './../middleware/isAuth';
import { Sub } from './../../entity/Sub';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { getRepository } from 'typeorm';
import { MyContext } from '../../types/MyContext';

@Resolver(Sub)
export class CreateSubResolver {
    @Mutation(() => Sub, { nullable: true })
    @UseMiddleware(isAuth)
    async createSub(
        @Arg("name") name: string,
        @Arg("title") title: string,
        @Arg("describtion") describtion: string,
        @Ctx() ctx: MyContext
    ): Promise<Sub> {
        const user = ctx.res.locals.user
        try {


            let errors: any = {};
            if (isEmpty(title)) errors.title = 'title should not be empty'
            if (isEmpty(name)) errors.name = 'name should not be empty'
            if (isEmpty(describtion)) errors.describtion = 'describtion should not be empty'

            if (Object.keys(errors).length > 0) {
                console.log(errors);
                throw new Error(" Input should not be empty")
            }
            const existingSub = await getRepository(Sub)
                .createQueryBuilder('sub')
                .where('lower(sub.name) = :name', { name: name.toLowerCase() })
                .getOne();

            if (existingSub) {
                throw new Error(' Sub exists already')
            }
            const sub = new Sub({ name, describtion, title, user })
            sub.follower = [user]
            await sub.save()
            console.log(sub);

            return sub

        } catch (error) {
            console.log(error);
            throw new Error(error.message)
        }
    }
}
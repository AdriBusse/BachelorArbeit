import { isAuth } from './../middleware/isAuth';
import { Sub } from './../../entity/Sub';
import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";

@Resolver(Sub)
export class UpdateSubResolver {
    @Mutation(() => Sub, { nullable: true })
    @UseMiddleware(isAuth)
    async updateSub(
        @Arg("name") name: string,
        @Arg("title") title: string,
        @Arg("describtion") describtion: string,
        // @Ctx() ctx: MyContext
    ): Promise<Sub> {
        // const user = ctx.res.locals.user
        try {
            const updatedSub = await Sub.findOneOrFail({ where: { name } })
            await Sub.update(updatedSub.id, { title, describtion })


            return updatedSub

        } catch (error) {
            console.log(error);
            throw new Error(error.message)
        }
    }
}
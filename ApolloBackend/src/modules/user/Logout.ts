import { MyContext } from "../../types/MyContext";
import { Ctx, Mutation, Resolver } from "type-graphql";
import cookie from 'cookie';


@Resolver()
export class LogoutResolver {
    @Mutation(() => Boolean)
    async logout(
        @Ctx() ctx: MyContext
    ): Promise<Boolean> {
        ctx.res.set(
            'Set-Cookie',
            cookie.serialize('token', '', {
                httpOnly: true, //Cookie cannot be accessed by JS
                secure: false, // with true Cookie will just send over HTTPS. In Dev we dont have it
                sameSite: 'strict',
                expires: new Date(0),
                path: '/',
            })
        )
        return true

    }
}
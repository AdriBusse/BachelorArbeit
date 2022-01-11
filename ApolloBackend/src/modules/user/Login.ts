import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import bcrypt from "bcryptjs"
import User from "../../entity/User"
import { MyContext } from "../../types/MyContext";
import { isEmpty } from "class-validator";
import jwt from 'jsonwebtoken';
import cookie from 'cookie';




@Resolver(User)
export class LoginResolver {


    @Mutation(() => User, { nullable: true })
    async login(
        @Arg("username") username: string,
        @Arg("password") password: string,
        @Ctx() ctx: MyContext
    ): Promise<User> {
        try {
            let errors: any = {};
            if (isEmpty(username)) errors.username = 'Username should not be empty';
            if (isEmpty(password)) errors.password = 'Password should not be empty';
            if (Object.keys(errors).length > 0) {
                console.log(errors);
                throw new Error(" Input should not be empty")
            }
            const user = await User.findOne({ where: { username } });
            if (!user) {
                throw new Error('User not found')
            }
            const passwordMatches = await bcrypt.compare(password, user!.password);

            if (!passwordMatches)
                throw new Error('Wrong Credentials');

            const token = jwt.sign({ username }, process.env.JWT_SECRET!);
            ctx.res.set('Set-Cookie',
                cookie.serialize('token', token, {
                    httpOnly: true, //Cookie cannot be accessed by JS
                    secure: false, // with true Cookie will just send over HTTPS. In Dev we dont have it
                    sameSite: 'strict',
                    maxAge: 3600,
                    path: '/',
                }))
            return user!
        } catch (error) {
            console.log(error);
            throw new Error(error.message)
        }

    }
}

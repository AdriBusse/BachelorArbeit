import { Arg, Mutation, Resolver } from "type-graphql";
import User from "../../entity/User"
import { RegisterInput } from "./register/RegisterInput";
//import { sendMail } from "../utils/sendEmail"
//import { createConfirmationURL } from "../utils/createConfirmationURL";
import { validate } from "class-validator";
@Resolver(User)
export class RegisterResolver {



    @Mutation(() => User, { nullable: true })
    async register(
        @Arg("data") { username, email, password }: RegisterInput
    ): Promise<User> {

        try {
            let errors: any = {};
            const existingEmail = await User.findOne({ email });
            const existingUsername = await User.findOne({ username });
            if (existingEmail) {
                throw new Error("Email already in use")
            }

            if (existingUsername) {
                throw new Error("Username already in use")
            }

            const user = await User.create(
                { username, email, password })

            errors = await validate(user)
            if (errors.length > 0) {
                throw new Error(errors)
            }
            await user.save();

            //await sendMail(email, await createConfirmationURL(user.id))
            return user;
        } catch (error) {
            console.log(error);
            throw new Error(error.message)
        }
    }
}



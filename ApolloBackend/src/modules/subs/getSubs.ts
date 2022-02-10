import { Sub } from '../../entity/Sub';
import { Query, Resolver } from "type-graphql";


@Resolver(Sub)
export class GetSubsResolver {
    @Query(() => [Sub])
    async getSubs(
    ) {
        try {
            const subs = Sub.find({ relations: ["posts", "user"] })
            return subs
        } catch (error) {
            console.log(error);
            throw new Error(error.message)

        }
    }
}
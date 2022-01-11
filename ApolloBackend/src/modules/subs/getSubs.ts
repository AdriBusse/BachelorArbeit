import { Sub } from '../../entity/Sub';
import { Info, Query, Resolver } from "type-graphql";


@Resolver(Sub)
export class GetSubsResolver {
    @Query(() => [Sub])
    async getSubs(
        @Info() info: any
    ) {
        try {
            const subs = Sub.find({ relations: ["posts", "user"] })
            info.cacheControl.setCacheHint({ maxAge: 1000 })
            return subs
        } catch (error) {
            console.log(error);
            throw new Error(error.message)

        }
    }
}
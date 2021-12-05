import { Sub } from './../../entity/Sub';
import { Arg, Query, Resolver } from "type-graphql";
import { isEmpty } from 'class-validator';
import { getRepository } from 'typeorm';

@Resolver()
export class SearchSubResolver {
    @Query(() => [Sub])
    async searchSub(
        @Arg("name") name: string,
    ): Promise<Sub[]> {
        try {
            if (isEmpty(name)) {
                throw new Error("Name should not be Empty")
            }

            const subs = await getRepository(Sub)
                .createQueryBuilder()
                .where('LOWER(name) LIKE :name', {
                    name: `%${name.toLowerCase().trim()}%`,
                }) //%% for find sth which include string
                .getMany();

            return subs

        } catch (error) {
            console.log(error);
            throw new Error(error.message)

        }
    }
}
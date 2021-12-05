import { ownSub } from './uploadImage/ownSub';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload"
import { createWriteStream } from "fs";
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../../types/MyContext';
import { Sub } from '../../entity/Sub';
import fs from 'fs';

@Resolver()
export class SubUploadResolver {
    @UseMiddleware(isAuth)
    @Mutation(() => Boolean)
    async subUpload(
        @Ctx() ctx: MyContext,
        @Arg("location") location: "banner" | "image",
        @Arg("name") name: string,
        @Arg("picture", () => GraphQLUpload) {
            createReadStream,
            filename
        }: FileUpload): Promise<boolean> {
        console.log("in resolver");

        const sub = await Sub.findOneOrFail({ where: { name } });
        const owns = await ownSub(ctx.res.locals.user, sub)
        if (!owns) {
            throw new Error("You dont own this Sub!!")
        }
        let oldImageUrn: string = '';
        let idfileName: string = '';
        if (location === "banner") {
            oldImageUrn = sub.bannerUrn || ""
            idfileName = Date.now() + filename
            return new Promise(async (resolve, reject) => {
                createReadStream()
                    .pipe(createWriteStream(__dirname + `/../../../public/images/subs/banner/${idfileName}`))
                    .on("finish", async () => {
                        sub.bannerUrn = idfileName
                        console.log("???????<<<<>>??M?", idfileName);

                        await sub.save()
                        oldImageUrn !== "" ? fs.unlinkSync(__dirname + `/../../../public/images/subs/banner/${oldImageUrn}`) : null
                        return resolve(true)
                    })
                    .on("error", () => reject(false))
            })

        }
        if (location === "image") {
            oldImageUrn = sub.imageUrn || ""
            idfileName = Date.now() + filename

            return new Promise(async (resolve, reject) => {
                createReadStream()
                    .pipe(createWriteStream(__dirname + `/../../../public/images/subs/image/${idfileName}`))
                    .on("finish", async () => {
                        sub.imageUrn = idfileName
                        await sub.save()
                        oldImageUrn !== "" ? fs.unlinkSync(__dirname + `/../../../public/images/subs/image/${oldImageUrn}`) : null
                        resolve(true)
                    })
                    .on("error", () => reject(false))
            })

        }
        return false
    }
}

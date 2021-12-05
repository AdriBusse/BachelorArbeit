import "reflect-metadata"
import { ApolloServer } from 'apollo-server-express'
import Express from 'express'
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser"
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { createSchema } from "./utils/createSchema";
import dotenv from 'dotenv';
import user from "./modules/middleware/user";
import { graphqlUploadExpress } from "graphql-upload";
import cors from "cors"
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
dotenv.config({ path: __dirname + '/../.env' });


declare module 'express-session' {
    interface Session {
        userId: any;
    }
}

const main = async () => {
    try {
        await createConnection()

    } catch (error) {
        console.log(error);

    }



    const schema = await createSchema()

    const apolloServer = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
        context: ({ req, res }: any) => ({ req, res }), // just for access the context
    })

    const app = Express()
    app.use(Express.static(__dirname + '/../public'))

    app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));

    app.use(cors({
        credentials: true,
        origin: ['http://localhost:3000']
    }))
    app.use(cookieParser())
    app.use(user)

    // const RedisStore = connectRedis(session)


    await apolloServer.start();
    app.use(graphqlUploadExpress());
    apolloServer.applyMiddleware({
        app, cors: {
            credentials: true,
            origin: ['https://studio.apollographql.com', 'http://localhost:3000'],
        }
    })

    app.listen(4000, () => { console.log("app start on http://localhost:4000/graphql") });


}
main()
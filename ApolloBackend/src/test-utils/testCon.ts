import { createConnection } from "typeorm"

export const testCon = async (drop: boolean = false) => {
    return await createConnection({
        name: "default",
        type: "postgres",
        host: "localhost",
        port: 5431,
        username: "admin",
        password: "admin",
        database: "reddit-test",
        synchronize: drop,
        dropSchema: drop,
        entities: [
            __dirname + "/../entity/*.*"
        ]
    })
}
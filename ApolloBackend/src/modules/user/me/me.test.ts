import User from './../../../entity/User';
import { gCall } from './../../../test-utils/gCall';
import { Connection } from "typeorm"
import { testCon } from "../../../test-utils/testCon"
import faker from 'faker';

let conn: Connection
beforeAll(async () => {
    conn = await testCon()
})

afterAll(async () => {
    await conn.close()
})

const meQuery = `
 {
  me {
    id
    firstName
    lastName
    email
    name
  }
}
`;
describe('ME', () => {
    it('get user', async () => {
        const user = await User.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }).save()

        const res = await gCall({
            source: meQuery,
            userId: user.id
        });

        expect(res).toMatchObject({
            data: {
                me: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            }
        })
    })

    it("return null", async () => {
        const res = await gCall({
            source: meQuery,
        });

        expect(res).toMatchObject({
            data: {
                me: null
            }
        })
    })
})
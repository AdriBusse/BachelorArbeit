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

const registerMutation = `
mutation Register($data: RegisterInput!) {
  register(
    data: $data
  ) {
    id
    firstName
    lastName
    email
    name
  }
}
`;
describe('Register', () => {
    it('create the user', async () => {
        const person = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }
        const res = await gCall({
            source: registerMutation,
            variableValues: {
                data: person
            }
        });
        expect(res).toMatchObject({
            data: {
                register: {
                    firstName: person.firstName,
                    lastName: person.lastName,
                    email: person.email
                }
            }
        });

        const dbUser = await User.findOne({ where: { email: person.email } })
        expect(dbUser).toBeDefined()

    })
})
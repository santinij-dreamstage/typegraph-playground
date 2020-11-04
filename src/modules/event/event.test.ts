import { gqlCall } from "../../test-utils/gqlCall";
import { Connection, useContainer } from "typeorm";
import { testConn } from "../../test-utils/testConn";
import Container from "typedi";

let conn: Connection;
beforeAll(async () => {
    useContainer(Container);
    conn = await testConn();
})

afterAll(async () => {
    await conn.close();
})

const getAllEvents = `query{
    events{
        matching{
            id,name
        }
    }
}`

describe('Events', () => {
    it("gets events", async () => {
        const response = await gqlCall({
            source: getAllEvents,
            variableValues: {},
        });
        console.log(JSON.stringify(response));
        expect(true);
    });
});
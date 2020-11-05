import { gqlCall } from "./test-utils/gqlCall";
import {PrismaClient} from "@prisma/client";

let conn: PrismaClient;
beforeAll(async () => {
    conn = new PrismaClient();
})

afterAll(async () => {
    await conn.$disconnect();
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
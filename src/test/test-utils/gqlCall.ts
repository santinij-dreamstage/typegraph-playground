import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "type-graphql";
import { createSchema } from "../../graphql/createSchema";

interface Options {
    source: string;
    variableValues?: Maybe<{
        [key: string]: any;
    }>,
}

let schema: GraphQLSchema;

export const gqlCall = async ({ source, variableValues }: Options) => {
    if (!schema) {
        schema = await createSchema();
    }
    return graphql({
        schema: schema,
        source: source,
        variableValues,
    })
}
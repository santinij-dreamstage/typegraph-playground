import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "type-graphql";
import Container from "typedi";
import { useContainer } from "typeorm";
import { createSchema } from "../createSchema";

interface Options {
    source: string;
    variableValues?: Maybe<{
        [key: string]: any;
    }>,
}

let schema: GraphQLSchema;

export const gqlCall = async ({ source, variableValues }: Options) => {
    if (!schema) {
        useContainer(Container);
        schema = await createSchema(Container);
    }
    return graphql({
        schema: schema,
        source: source,
        variableValues,
    })
}
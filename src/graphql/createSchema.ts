import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { EventPerformerResolver } from "./resolvers/EventPerformerResolver";
import { EventTicketResolver } from "./resolvers/EventTicketResolver";
import { EventResolver } from "./resolvers/EventResolver";
// import { ProfileTicketResolver } from "./modules/tickets/ProfileTicketResolver";
// import { PurchasedTicketResolver } from "./modules/tickets/PurchasedTicketResolver";


export const createSchema = (): Promise<GraphQLSchema> => buildSchema({
    resolvers: [EventResolver, EventPerformerResolver, EventTicketResolver], //, PurchasedTicketResolver, ProfileTicketResolver],
})
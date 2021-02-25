import { GraphQLSchema } from "graphql";
import { buildSchema, ContainerGetter, ContainerType } from "type-graphql";
import { EventPerformerResolver } from "./modules/event-performer/EventPerformerResolver";
import { EventTicketResolver } from "./modules/event-ticket/EventTicketResolver";
import { EventResolver } from "./modules/event/EventResolver";
import { ProfileTicketResolver } from "./modules/tickets/ProfileTicketResolver";
import { PurchasedTicketResolver } from "./modules/tickets/PurchasedTicketResolver";


export const createSchema = (container?: ContainerType | ContainerGetter<any>): Promise<GraphQLSchema> => buildSchema({
    resolvers: [EventResolver, EventPerformerResolver, EventTicketResolver, PurchasedTicketResolver, ProfileTicketResolver],
    container: container,
})
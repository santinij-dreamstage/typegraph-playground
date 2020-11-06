import { DsUser } from "./DsUser";
import { EventTicket } from "./EventTicket";
import { VideoStream } from "./VideoStream";
import { Event } from "./Event";
import { Field, ID, ObjectType } from "type-graphql";
import { Pagination } from "./Pagination";
import {ticket as DbPurchasedTicket} from "@prisma/client";

@ObjectType()
export class PurchasedTickets {
    constructor(tickets: DbPurchasedTicket[], page: Pagination) {
        this.matching = tickets;
        this.pagination = page;
    }
    
    @Field(() => [PurchasedTicket])
    matching: DbPurchasedTicket[];

    @Field(() => Pagination)
    pagination: Pagination
}

@ObjectType()
export class PurchasedTicket {

    @Field(() => ID)
    id: string;

    @Field(() => DsUser)
    owner: DsUser;

    @Field(() => EventTicket)
    ticket: EventTicket;

    @Field(() => Event)
    event: Event;
    
    @Field({ deprecationReason: "Use liveStreams field with streamType Primary"})
    playbackId: string;

    @Field({ deprecationReason: "Use replayStreams field with streamType Primary" })
    replayId: string;
    
    @Field(() => [VideoStream], { nullable: true })
    liveStreams: VideoStream[];
    
    @Field(() => [VideoStream], {nullable: true})
    replayStreams: VideoStream[];

    @Field(() => Date, { name: "purchasedAt"})
    purchase_time_utc: Date;

    @Field(() => Date, {name: "createdAt"})
    created_time_utc: Date;
    
    @Field(() => Date, { name: "updatedAt" })
    last_updated_time_utc: Date;
}
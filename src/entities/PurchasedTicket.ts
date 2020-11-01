import { DsUser } from "./DsUser";
import { EventTicketInfo } from "./EventTicketInfo";
import { VideoStream } from "../types/VideoStream";
import { Event } from "./Event";
import { Field, ID, ObjectType } from "type-graphql";
import { Pagination } from "../types/Pagination";
import {Ticket} from "./Ticket";
import { Entity } from "typeorm";

@ObjectType()
export class PurchasedTickets {
    constructor(tickets: PurchasedTicket[], page: Pagination) {
        this.matching = tickets;
        this.pagination = page;
    }
    
    @Field(() => [PurchasedTicket])
    matching: PurchasedTicket[];

    @Field(() => Pagination)
    pagination: Pagination
}

@ObjectType()
@Entity("ticket", { schema: "public" })
export class PurchasedTicket extends Ticket {
    constructor() {
        super();
    }

    @Field(() => DsUser)
    owner: DsUser;

    @Field(() => EventTicketInfo)
    ticket: EventTicketInfo;

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

    @Field()
    purchasedAt: Date;

    @Field()
    createdAt: Date;
    
    @Field()
    updatedAt: Date;
}
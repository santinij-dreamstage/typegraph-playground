import { DsUser } from "./DsUser";
import { EventTicket } from "./EventTicket";
import { Event } from "./Event";
import { Field, ID, InputType, ObjectType, registerEnumType } from "type-graphql";
// import { Ticket } from "./Ticket";
import { Pagination } from "./Pagination";
// import { TicketVoucher } from "./TicketVoucher";
// import { TicketIntent } from "./TicketIntent";

export enum ProfileTicketType {
    Standard = "Standard",
    Voucher = "Voucher",
}

export enum ProfileTicketStatus {
    Unknown = "Unknown",
    Purchased = "Purchased",
    Refunded = "Refunded",
    Available = "Available",
    Voided = "Voided",
    Redeemed = "Redeemed",
}

registerEnumType(ProfileTicketType, {
    name: "ProfileTicketType",
})

registerEnumType(ProfileTicketStatus, {
    name: "ProfileTicketStatus",
})

@ObjectType()
export class ProfileTickets {
    constructor(tickets: IProfileTicketQueryResult[], page: Pagination) {
        this.matching = tickets;
        this.pagination = page;
    }

    @Field(() => [ProfileTicket])
    matching: IProfileTicketQueryResult[];

    @Field(() => Pagination)
    pagination: Pagination;
}

export interface IProfileTicketQueryResult {
    id: string;
    intentId: string;
    voucherId?: string;
    ticketId?: string;
    ticketInfoId: string;
    holderId?: string;
    purchaserId: string;
    status: string;
    redemptionCode?: string;
    purchaseTimeUtc?: Date;
    createdTimeUtc: Date;
    lastUpdatedTimeUtc: Date;
}

export interface IProfileTicketSearch {
    userCognitoId: string;
    search?: SearchProfileTicket;
}

@ObjectType()
export class ProfileTicket {

    @Field(() => ID)
    id: string;

    @Field(() => DsUser, { nullable: true })
    owner?: DsUser;

    @Field(() => DsUser)
    purchaser: DsUser;

    @Field(() => ProfileTicketType)
    ticketType: ProfileTicketType;

    @Field(() => ProfileTicketStatus)
    ticketStatus: ProfileTicketStatus;

    @Field(() => EventTicket)
    eventTicket: EventTicket;

    @Field(() => Event)
    event: Event;

    @Field(() => ID, { nullable: true })
    redemptionCode?: string;

    @Field({ nullable: true })
    purchasedAt?: Date;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

@InputType()
export class SearchProfileTicket {
    @Field(() => ID, { nullable: true })
    id: string;

    @Field(() => [ProfileTicketStatus], { nullable: true })
    status: ProfileTicketStatus[];
}

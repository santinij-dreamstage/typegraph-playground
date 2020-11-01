import { DsUser } from "../entities/DsUser";
import { EventTicketInfo } from "../entities/EventTicketInfo";
import { Event } from "../entities/Event";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { Ticket } from "../entities/Ticket";
import { Entity } from "typeorm";

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
@Entity("ticket", { schema: "public" })
export class PurchasedTicket extends Ticket {

    @Field(() => DsUser, {nullable: true})
    owner: DsUser;

    @Field(() => ProfileTicketType)
    ticketType: ProfileTicketType;

    @Field(() => ProfileTicketStatus)
    ticketStatus: ProfileTicketStatus;

    @Field(() => EventTicketInfo)
    eventTicket: EventTicketInfo;

    @Field(() => Event)
    event: Event;
    
    @Field({ nullable: true })
    redemptionCode: string;

    @Field({ nullable: true })
    purchasedAt: Date;

    @Field()
    createdAt: Date;
    
    @Field()
    updatedAt: Date;
}
import { DsUser } from "../entities/DsUser";
import { EventTicketInfo } from "../entities/EventTicketInfo";
import { Event } from "../entities/Event";
import { Field, ID, InputType, ObjectType, registerEnumType } from "type-graphql";
import { Ticket } from "../entities/Ticket";
import { Repository } from "typeorm";
import { Pagination } from "../types/Pagination";
import { TicketVoucher } from "./TicketVoucher";
import { TicketIntent } from "./TicketIntent";

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

@ObjectType()
export class ProfileTicket implements IProfileTicketQueryResult {
    intentId: string;
    voucherId: string;
    ticketId?: string | undefined;
    ticketInfoId: string;
    holderId?: string | undefined;
    purchaserId: string;
    status: string;
    purchaseTimeUtc?: Date | undefined;
    createdTimeUtc: Date;
    lastUpdatedTimeUtc: Date;

    @Field(() => ID)
    id: string;

    @Field(() => DsUser, {nullable: true})
    owner?: DsUser;

    @Field(() => DsUser)
    purchaser: DsUser;

    @Field(() => ProfileTicketType)
    ticketType: ProfileTicketType;

    @Field(() => ProfileTicketStatus)
    ticketStatus: ProfileTicketStatus;

    @Field(() => EventTicketInfo)
    eventTicket: EventTicketInfo;

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

    public static async getTickets(repo: Repository<Ticket>, user_id: string): Promise<IProfileTicketQueryResult[] | undefined> {
        const tickets = await repo.createQueryBuilder("ticket")
            .select(["ticket_intent.id as ticket_intent_id",
                "ticket.id",
                "ticket_intent.event_ticket_info_id",
                "ticket.holder_id",
                "ticket_intent.ds_user_id",
                "ticket.status",
                "ticket.purchase_time_utc",
                "ticket.created_time_utc",
                "ticket.last_updated_time_utc"])
            .innerJoin(TicketIntent, "ticket_intent", "ticket.ticket_intent_id = ticket_intent.id")
            .where("ticket.holder_id = :id", { id: user_id })
            .getRawMany();

        const result: IProfileTicketQueryResult[] = [];
        for (const ticket of tickets) {
            result.push({
                id: ticket.ticket_id,
                intentId: ticket.ticket_intent_id,
                ticketId: ticket.ticket_id,
                ticketInfoId: ticket.event_ticket_info_id,
                holderId: ticket.holder_id,
                purchaserId: ticket.ds_user_id,
                status: ticket.status,
                purchaseTimeUtc: ticket.purchase_time_utc,
                createdTimeUtc: ticket.created_time_utc,
                lastUpdatedTimeUtc: ticket.last_updated_time_utc,
            });
        }
        return result;
    }

    public static async getTicketVouchers(repo: Repository<TicketVoucher>, user_id: string): Promise<IProfileTicketQueryResult[] | undefined> {
        const vouchers = await repo.createQueryBuilder("ticket_voucher")
            .select(["ticket_intent.id",
                "ticket_voucher.id",
                "ticket.id",
                "ticket_intent.event_ticket_info_id",
                "ticket.holder_id",
                "ticket_intent.ds_user_id",
                "ticket_voucher.status",
                "ticket_voucher.ticket_code",
                "ticket.purchase_time_utc",
                "ticket_voucher.created_time_utc",
                "ticket_voucher.last_updated_time_utc"])
            .innerJoin(TicketIntent, "ticket_intent", "ticket_voucher.ticket_intent_id = ticket_intent.id")
            .leftJoin(Ticket, "ticket", "ticket_voucher.ticket_id = ticket.id")
            .where("(ticket.holder_id IS NULL OR ticket.holder_id <> ticket_intent.ds_user_id)")
            .andWhere("ticket_intent.ds_user_id = :id", { id: user_id })
            .getRawMany();
        
        const result: IProfileTicketQueryResult[] = [];
        for (const voucher of vouchers){
            result.push({
                id: voucher.ticket_voucher_id,
                intentId: voucher.ticket_intent_id,
                voucherId: voucher.ticket_voucher_id,
                ticketId: voucher.ticket_id,
                ticketInfoId: voucher.event_ticket_info_id,
                holderId: voucher.holder_id,
                purchaserId: voucher.ds_user_id,
                status: voucher.status,
                redemptionCode: voucher.ticket_code,
                purchaseTimeUtc: voucher.purchase_time_utc,
                createdTimeUtc: voucher.created_time_utc,
                lastUpdatedTimeUtc: voucher.last_updated_time_utc,
            });
        }
        return result;

        /*

        {
    "ticket_voucher_id": "9f6337c4-ecc8-4907-8ff6-c928f47fb384",
    "ticket_intent_id": "a4a16f92-a721-4fba-a92f-be356707da2a",
    "ticket_id": null,
    "event_ticket_info_id": "6b12b1c8-f7ca-4a91-902c-c1ca2402fafc",
    "holder_id": null,
    "ds_user_id": "cd6b69d6-8091-499b-96eb-31ca95761a89",
    "ticket_code": "776564f7-37a4-46a4-ae32-c44f463f6717",
    "purchase_time_utc": null,
    "created_time_utc": "2020-10-30T04:06:52.476Z",
    "last_updated_time_utc": "2020-10-30T04:06:52.476Z"
},

                let mut offsets = vec![];
            for s in search.voucher_status {
                offsets.push(format!("${}", binder.current_offset()));
                binder.bind(match s {
                    DSProfileTicketStatus::Redeemed => "Assigned",
                    DSProfileTicketStatus::Available => "Created",
                    DSProfileTicketStatus::Voided => "Voided",
                    _ => "Unknown",
                });
            }
    
            if !offsets.is_empty() {
                query = format!(
                    "{} AND ticket_voucher.status IN ({})",
                    query,
                    offsets.join(", "),
                );
            }
        */
    }
}

@InputType()
export class SearchProfileTicket {
    @Field(() => ID, { nullable: true })
    id: string;

    @Field(() => [ProfileTicketStatus], {nullable: true})
    status: ProfileTicketStatus;
}

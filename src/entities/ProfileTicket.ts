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

export interface IProfileTicketSearch {
    userId: string;
    search?: SearchProfileTicket;
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

    @Field(() => DsUser, { nullable: true })
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

    public static async getOwnedTickets(repo: Repository<Ticket>, search: IProfileTicketSearch): Promise<IProfileTicketQueryResult[] | undefined> {
        const baseQuery = repo.createQueryBuilder("ticket")
            .select(["ticket_intent.id as ticket_intent_id",
                "ticket.id",
                "ticket_intent.event_ticket_info_id",
                "ticket.holder_id",
                "ticket_intent.ds_user_id",
                "ticket.status as ticket_status",
                "ticket.purchase_time_utc",
                "ticket.created_time_utc",
                "ticket.last_updated_time_utc"])
            .innerJoin(TicketIntent, "ticket_intent", "ticket.ticket_intent_id = ticket_intent.id")
            .where("ticket.holder_id = :id", { id: search.userId })

        if (search.search) {
            if (search.search.id) {
                baseQuery.andWhere("ticket.id = :id", { id: search.search.id });
            }
            if (search.search.status) {
                baseQuery.andWhere("ticket.status in (:...statuses)", { statuses: search.search.status });
            }
        }
        const tickets = await baseQuery.getRawMany();

        const result: IProfileTicketQueryResult[] = [];
        tickets.forEach(ticket => result.push({
            id: ticket.ticket_id,
            intentId: ticket.ticket_intent_id,
            ticketId: ticket.ticket_id,
            ticketInfoId: ticket.event_ticket_info_id,
            holderId: ticket.holder_id,
            purchaserId: ticket.ds_user_id,
            status: ticket.ticket_status,
            purchaseTimeUtc: ticket.purchase_time_utc,
            createdTimeUtc: ticket.created_time_utc,
            lastUpdatedTimeUtc: ticket.last_updated_time_utc,
        }));
        return result;
    }

    public static async getTicketVouchers(repo: Repository<TicketVoucher>, search: IProfileTicketSearch): Promise<IProfileTicketQueryResult[] | undefined> {
        const baseQuery = repo.createQueryBuilder("ticket_voucher")
            .select(["ticket_intent.id",
                "ticket_voucher.id",
                "ticket.id",
                "ticket_intent.event_ticket_info_id",
                "ticket.holder_id",
                "ticket_intent.ds_user_id",
                "ticket_voucher.status as voucher_status",
                "ticket_voucher.ticket_code",
                "ticket.purchase_time_utc",
                "ticket_voucher.created_time_utc",
                "ticket_voucher.last_updated_time_utc"])
            .innerJoin(TicketIntent, "ticket_intent", "ticket_voucher.ticket_intent_id = ticket_intent.id")
            .leftJoin(Ticket, "ticket", "ticket_voucher.ticket_id = ticket.id")
            .where("(ticket.holder_id IS NULL OR ticket.holder_id <> ticket_intent.ds_user_id)")
            .andWhere("ticket_intent.ds_user_id = :id", { id: search.userId });

        if (search.search) {
            if (search.search.id) {
                baseQuery.andWhere("ticket_voucher.id = :id", { id: search.search.id });
            }
            if (search.search.status && search.search.status.length > 0 ) {
                baseQuery.andWhere("ticket_voucher.status in (:...statuses)", { statuses: search.search.status });
            }
        }
        const vouchers = await baseQuery.getRawMany();

        const result: IProfileTicketQueryResult[] = [];
        vouchers.forEach(voucher => result.push({
            id: voucher.ticket_voucher_id,
            intentId: voucher.ticket_intent_id,
            voucherId: voucher.ticket_voucher_id,
            ticketId: voucher.ticket_id,
            ticketInfoId: voucher.event_ticket_info_id,
            holderId: voucher.holder_id,
            purchaserId: voucher.ds_user_id,
            status: voucher.voucher_status,
            redemptionCode: voucher.ticket_code,
            purchaseTimeUtc: voucher.purchase_time_utc,
            createdTimeUtc: voucher.created_time_utc,
            lastUpdatedTimeUtc: voucher.last_updated_time_utc,
        })
        );
        return result;
    }
}

@InputType()
export class SearchProfileTicket {
    @Field(() => ID, { nullable: true })
    id: string;

    @Field(() => [ProfileTicketStatus], { nullable: true })
    status: ProfileTicketStatus[];
}

import { empty, join, PrismaClient, sql, ticketWhereInput } from "@prisma/client";
import { IProfileTicketQueryResult, IProfileTicketSearch } from "../graphql/types/ProfileTicket";

//for some reason prisma is panicking on the queryRaw when the search/empty is included
export class TicketRepo {
    public static async getOwnedProfileTickets(repo: PrismaClient, search: IProfileTicketSearch): Promise<IProfileTicketQueryResult[] | null> {
        return await repo.$queryRaw`SELECT 
        "ticket_intent"."id" as "intentId" ,
        "ticket"."id" as "id",
        "ticket"."id" as "ticketId",
        "ticket_intent"."event_ticket_info_id" as "ticketInfoId",
        "ticket"."holder_id" as "holderId",
        "ticket_intent"."ds_user_id" as "purchaserId",
        "ticket"."status" as "status",
        "ticket"."purchase_time_utc" as "purchaseTimeUtc",
        "ticket"."created_time_utc" as "createdTimeUtc",
        "ticket"."last_updated_time_utc" as "lastUpdatedTimeUtc"
        FROM "ticket"
        JOIN "ticket_intent" on "ticket"."ticket_intent_id" = "ticket_intent"."id"
        WHERE "ticket"."holder_id" = ${search.userCognitoId}
        ${search.search && search.search.id ? sql`AND "ticket"."id" = ${search.search.id}` : empty}
        ${search.search && search.search.status ? sql`AND "ticket"."status" in (${join(search.search.status)})` : empty}`;
    }

    public static ticketHolderCognitoIdFilter(cognitoId: string): ticketWhereInput {
        return {
            ds_user_ds_userToticket_holder_id: { cognito_id: cognitoId }
        }
    }
    public static isPurchasedFilter(): ticketWhereInput {
        return {
            NOT: { purchase_time_utc: null }
        }
    }

    public static async getPurchasedTicketVouchers(repo: PrismaClient, search: IProfileTicketSearch): Promise<IProfileTicketQueryResult[] | undefined> {
        return await repo.$queryRaw`SELECT 
        "ticket_intent"."id" as "intentId",
        "ticket_voucher"."id" as "id",
        "ticket_voucher"."id" as "voucherId",
        "ticket"."id" as "ticketId",
        "ticket_intent"."event_ticket_info_id" as "ticketInfoId",
        "ticket"."holder_id" as "holderId",
        "ticket_intent"."ds_user_id" as "purchaserId",
        "ticket_voucher"."status" as "status",
        "ticket_voucher"."ticket_code" as "redemptionCode",
        "ticket"."purchase_time_utc" as "purchaseTimeUtc",
        "ticket_voucher"."created_time_utc" as "createdTimeUtc",
        "ticket_voucher"."last_updated_time_utc" as "lastUpdatedTimeUtc"
    FROM "ticket_voucher"
    JOIN "ticket_intent" on "ticket_voucher"."ticket_intent_id" = "ticket_intent".id
    LEFT JOIN "ticket" on "ticket_voucher"."ticket_id" = "ticket".id
    WHERE ("ticket"."holder_id" IS NULL OR "ticket"."holder_id" <> "ticket_intent"."ds_user_id")
    AND "ticket_intent"."ds_user_id" = ${search.userCognitoId}
    ${search.search && search.search.id ? sql`AND voucher.id = ${search.search.id}` : empty}
    ${search.search && search.search.status ? sql`AND voucher.status in (${join(search.search.status)})` : empty}`;
    }
}

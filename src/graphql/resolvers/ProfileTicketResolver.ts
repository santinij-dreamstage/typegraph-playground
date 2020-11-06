
import { Resolver, Query, Ctx, Arg, FieldResolver, Root, ResolverInterface, ID, UseMiddleware } from "type-graphql";
import { GqlContext } from "../GqlContext";
import { Event } from "../types/Event";
import { EventTicket } from "../types/EventTicket";
import { IProfileTicketQueryResult, IProfileTicketSearch, ProfileTicket, ProfileTickets, ProfileTicketStatus, ProfileTicketType, SearchProfileTicket } from "../types/ProfileTicket";
import { DsUser } from "../types/DsUser";
import { Pagination } from "../types/Pagination";
import { IsLoggedIn } from "../../middleware/authChecker";
import { event as DbEvent, event_ticket_info as DbEventTicket, ds_user as DbUser } from "@prisma/client";
import { UserRepo } from "../../repository/UserRepo";
import { TicketRepo } from "../../repository/TicketRepo";
import { EventRepo } from "../../repository/EventRepo";
import { EventTicketInfoRepo } from "../../repository/EventTicketInfoRepo";

@Resolver(() => ProfileTicket)
export class ProfileTicketResolver { // implements ResolverInterface<ProfileTicket>

    //#region Queries and Mutations
    @Query(() => ProfileTickets, { nullable: true })
    @UseMiddleware(IsLoggedIn)
    async profileTickets(@Ctx() { user, prisma }: GqlContext, @Arg("search", () => SearchProfileTicket, { nullable: true }) search?: SearchProfileTicket): Promise<ProfileTickets> {
        if (user) {
            console.debug(`args: ${JSON.stringify(search)}`);

            const ticketSearch: IProfileTicketSearch = {
                userCognitoId: user.sub,
                search: search,
            }
            const tickets = await TicketRepo.getOwnedProfileTickets(prisma, ticketSearch) || [];
            const vouchers = await TicketRepo.getPurchasedTicketVouchers(prisma, ticketSearch) || [];
            const profileTickets = vouchers.concat(tickets);

            return new ProfileTickets(profileTickets, new Pagination(1));
        } else {
            return new ProfileTickets([], new Pagination(1));
        }
    }
    //#endregion

    // #region Field Resolver implemenations
    @FieldResolver(() => ID)
    async id(@Root() ticket: IProfileTicketQueryResult): Promise<string> {
        return ticket.id;
    }

    @FieldResolver(() => DsUser, { nullable: true })
    async owner(@Root() ticket: IProfileTicketQueryResult, @Ctx() { prisma }: GqlContext): Promise<DbUser | null> {
        if (ticket.holderId) { 
            return await UserRepo.findOneById(prisma, ticket.holderId);
        }
        else {
            return null;
        }
    }

    @FieldResolver(() => DsUser)
    async purchaser(@Root() ticket: IProfileTicketQueryResult, @Ctx() { prisma }: GqlContext): Promise<DbUser> {
        return await UserRepo.findOneByIdOrFail(prisma, ticket.purchaserId);
    }

    @FieldResolver(() => ProfileTicketType)
    async ticketType(@Root() ticket: IProfileTicketQueryResult): Promise<ProfileTicketType> {
        if (ticket.voucherId) {
            return ProfileTicketType.Voucher;
        }
        return ProfileTicketType.Standard;
    }

    @FieldResolver(() => ProfileTicketStatus)
    async ticketStatus(@Root() ticket: IProfileTicketQueryResult): Promise<ProfileTicketStatus> {
        switch (ticket.status) {
            case "Purchased":
                return ProfileTicketStatus.Purchased;
            case "Refunded":
                return ProfileTicketStatus.Refunded;
            case "Redeemed":
                return ProfileTicketStatus.Redeemed;
            case "Assigned":
                return ProfileTicketStatus.Redeemed;
            case "Created":
                return ProfileTicketStatus.Available;
            case "Voided":
                return ProfileTicketStatus.Voided;
            default:
                return ProfileTicketStatus.Unknown;
        }
    }

    @FieldResolver(() => Event)
    async event(@Root() ticket: IProfileTicketQueryResult, @Ctx() { prisma }: GqlContext): Promise<DbEvent> {
        return await EventRepo.findEventFromEventTicketInfoId(prisma, ticket.ticketInfoId);
    }

    @FieldResolver(() => EventTicket)
    async eventTicket(@Root() ticket: IProfileTicketQueryResult, @Ctx() { prisma }: GqlContext): Promise<DbEventTicket> {
        return await EventTicketInfoRepo.findOneByIdOrFail(prisma, ticket.ticketInfoId);
    }

    @FieldResolver(() => ID, { nullable: true })
    async redemptionCode(@Root() ticket: IProfileTicketQueryResult): Promise<string | undefined> {
        return Promise.resolve(ticket.redemptionCode);
    }

    @FieldResolver({ nullable: true })
    async purchasedAt(@Root() ticket: IProfileTicketQueryResult): Promise<Date | undefined> {
        return ticket.purchaseTimeUtc;
    }
    @FieldResolver()
    async createdAt(@Root() ticket: IProfileTicketQueryResult): Promise<Date> {
        return ticket.createdTimeUtc;
    }
    @FieldResolver()
    async updatedAt(@Root() ticket: IProfileTicketQueryResult): Promise<Date> {
        return ticket.lastUpdatedTimeUtc;
    }
    // #endregion
}

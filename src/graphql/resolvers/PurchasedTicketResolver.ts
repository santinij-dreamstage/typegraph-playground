
import { Resolver, Query, Ctx, Arg, FieldResolver, Root, ID, UseMiddleware } from "type-graphql";
import { Event } from "../types/Event";
import { EventTicket } from "../types/EventTicket";
import { PurchasedTicket, PurchasedTickets } from "../types/PurchasedTicket";
import { DsUser } from "../types/DsUser";
import { VideoStream, StreamType } from "../types/VideoStream";
import { Pagination } from "../types/Pagination";
import { IsLoggedIn } from "../../middleware/authChecker";
import { GqlContext } from "../GqlContext";
import { event as DbEvent, ds_user as DbUser, ticket as DbTicket, ticketWhereInput, event_ticket_info as DbEventTicket } from "@prisma/client";
import { UserRepo } from "../../repository/UserRepo";
import { EventRepo } from "../../repository/EventRepo";
import { EventTicketInfoRepo } from "../../repository/EventTicketInfoRepo";
import { TicketRepo } from "../../repository/TicketRepo";

@Resolver(() => PurchasedTickets)
export class PurchasedTicketsResolver { // implements ResolverInterface<PurchasedTicket> {
    @FieldResolver(() => [PurchasedTicket])
    async matching(@Root() ticket: DbTicket, @Ctx() { prisma }: GqlContext): Promise<DbTicket[]> {
        console.log('made it i guess');
        throw new Error();
    }
}

@Resolver(() => PurchasedTicket)
export class PurchasedTicketResolver { // implements ResolverInterface<PurchasedTicket> {

    //#region Queries and Mutations
    @Query(() => PurchasedTickets, { nullable: true })
    @UseMiddleware(IsLoggedIn)
    async purchasedTickets(@Ctx() { user, prisma }: GqlContext, @Arg("search", () => ID, { nullable: true }) ticketId?: string): Promise<PurchasedTickets> {
        //the IsLoggedIn middleware will throw an error if user claims aren't set but we'll handle it anyway
        if (user) {
            console.debug(`args: ${JSON.stringify(ticketId)}`);

            const filters: ticketWhereInput[] = [];
            if (ticketId) {
                filters.push({ id: ticketId })
            }
            filters.push(TicketRepo.ticketHolderCognitoIdFilter(user.sub))
            filters.push(TicketRepo.isPurchasedFilter())
            const tickets = await prisma.ticket.findMany({
                where: {
                    AND: filters
                }
            })

            return new PurchasedTickets(tickets, new Pagination(1));
        } else {
            return new PurchasedTickets([], new Pagination(1));
        }
    }
    //#endregion

    // #region Field Resolver implemenations

    @FieldResolver(() => DsUser)
    async owner(@Root() ticket: DbTicket, @Ctx() { prisma }: GqlContext): Promise<DbUser> {
        return await UserRepo.findOneByIdOrFail(prisma, ticket.holder_id);
    }

    @FieldResolver(() => DsUser)
    async purchaser(@Root() ticket: DbTicket, @Ctx() { prisma }: GqlContext): Promise<DbUser> {
        return await UserRepo.findOneByIdOrFail(prisma, ticket.purchaser_id);
    }

    @FieldResolver(() => EventTicket)
    async ticket(@Root() ticket: DbTicket, @Ctx() { prisma }: GqlContext): Promise<DbEventTicket> {
        return EventTicketInfoRepo.findOneByIdOrFail(prisma, ticket.ticket_id);
    }

    @FieldResolver(() => Event)
    async event(@Root() ticket: DbTicket, @Ctx() { prisma }: GqlContext): Promise<DbEvent> {
        return await EventRepo.findEventFromEventTicketInfoId(prisma, ticket.ticket_id);
    }

    @FieldResolver()
    async playbackId(@Root() ticket: DbTicket): Promise<string> {
        return 'TODO';
    }

    @FieldResolver()
    async replayId(@Root() ticket: DbTicket): Promise<string> {
        return 'TODO';
    }

    @FieldResolver(() => [VideoStream], { nullable: true })
    async liveStreams(@Root() _ticket: DbTicket): Promise<VideoStream[]> {
        return [new VideoStream('TODO', StreamType.Primary)];
    }

    @FieldResolver(() => [VideoStream], { nullable: true })
    async replayStreams(@Root() _ticket: DbTicket): Promise<VideoStream[]> {
        return [new VideoStream('TODO', StreamType.Primary)];
    }

    @FieldResolver(() => Date)
    async purchasedAt(@Root() ticket: DbTicket): Promise<Date> {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return ticket.purchase_time_utc!; //purchased tickets are required to have a purchase time!
    }
    // #endregion
}

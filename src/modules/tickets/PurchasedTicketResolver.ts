
import { Resolver, Query, Ctx, Arg, FieldResolver, Root, ResolverInterface, ID, UseMiddleware } from "type-graphql";
import { Repository} from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Event } from "../../entities/Event";
import { EventTicketInfo } from "../../entities/EventTicketInfo";
import { PurchasedTicket, PurchasedTickets } from "../../entities/PurchasedTicket";
import { DsUser } from "../../entities/DsUser";
import { VideoStream, StreamType } from "../../types/VideoStream";
import { Pagination } from "../../types/Pagination";
import { IsLoggedIn } from "../../middleware/authChecker";
import { GqlContext } from "../../types/GqlContext";

@Resolver(() => PurchasedTicket)
export class PurchasedTicketResolver implements ResolverInterface<PurchasedTicket> {  //implements ResolverInterface<Event>
    // private readonly genreTransformer: GenreTransformer;
    constructor(
        @InjectRepository(PurchasedTicket) private readonly ticketRepo: Repository<PurchasedTicket>,
        @InjectRepository(DsUser) private readonly userRepo: Repository<DsUser>,
        @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
        @InjectRepository(EventTicketInfo) private readonly eventTicketInfoRepo: Repository<EventTicketInfo>,
    ) {
    }

    //#region Queries and Mutations
    @Query(() => PurchasedTickets, { nullable: true })
    @UseMiddleware(IsLoggedIn)
    async purchasedTickets(@Ctx() ctx: GqlContext, @Arg("search", () => ID, { nullable: true }) ticketId?: string): Promise<PurchasedTickets> {
        if (ctx.user) {
            console.debug(`args: ${JSON.stringify(ticketId)}`);

            const baseQuery = this.ticketRepo.createQueryBuilder("ticket")
                .innerJoin("ticket.holder", "DsUser", "cognito_id = :id", { id: ctx.user.sub })
                .where("ticket.purchase_time_utc is not null")

            if (ticketId) {
                baseQuery.andWhere("ticket.id = :id", { id: ticketId });
            }
            const tickets = await baseQuery.getMany();
            return new PurchasedTickets(tickets, new Pagination(1));
        } else {
            return new PurchasedTickets([], new Pagination(1));
        }
    }
    //#endregion

    // #region Field Resolver implemenations
    @FieldResolver(() => ID)
    async id(@Root() ticket: PurchasedTicket): Promise<string> {
        return ticket.id;
    }

    @FieldResolver(() => DsUser)
    async owner(@Root() ticket: PurchasedTicket): Promise<DsUser> {
        return this.userRepo.findOneOrFail(ticket.holderId);
    }

    @FieldResolver(() => DsUser)
    async purchaser(@Root() ticket: PurchasedTicket): Promise<DsUser> {
        return this.userRepo.findOneOrFail(ticket.purchaserId);
    }

    @FieldResolver(() => EventTicketInfo)
    async ticket(@Root() ticket: PurchasedTicket): Promise<EventTicketInfo> {
        return this.eventTicketInfoRepo.findOneOrFail(ticket.ticketId);
    }

    @FieldResolver(() => Event)
    async event(@Root() ticket: PurchasedTicket): Promise<Event> {
        return Event.getEventFromEventTicketInfoId(this.eventRepo, ticket.id);
    }

    @FieldResolver()
    async playbackId(@Root() ticket: PurchasedTicket): Promise<string> {
        return 'TODO';
    }

    @FieldResolver()
    async replayId(@Root() ticket: PurchasedTicket): Promise<string> {
        return 'TODO';
    }

    @FieldResolver(() => [VideoStream], { nullable: true })
    async liveStreams(@Root() _ticket: PurchasedTicket): Promise<VideoStream[]> {
        return [new VideoStream('TODO', StreamType.Primary)];
    }

    @FieldResolver(() => [VideoStream], { nullable: true })
    async replayStreams(@Root() _ticket: PurchasedTicket): Promise<VideoStream[]> {
        return [new VideoStream('TODO', StreamType.Primary)];
    }

    @FieldResolver()
    async purchasedAt(@Root() ticket: PurchasedTicket): Promise<Date> {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return ticket.purchaseTimeUtc!; //purchased tickets are required to have a purchase time!
    }
    @FieldResolver()
    async createdAt(@Root() ticket: PurchasedTicket): Promise<Date> {
        return ticket.createdTimeUtc;
    }
    @FieldResolver()
    async updatedAt(@Root() ticket: PurchasedTicket): Promise<Date> {
        return ticket.lastUpdatedTimeUtc;
    }
    // #endregion
}

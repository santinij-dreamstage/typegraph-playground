
import { Resolver, Mutation, Query, Ctx, Arg, FieldResolver, Root, ResolverInterface, ID } from "type-graphql";
import { Repository, IsNull, Not } from "typeorm";
import { GqlContext } from "../../types/GqlContext";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Ticket } from "../../entities/Ticket";
import { Event } from "../../entities/Event";
import { EventTicketInfo } from "../../entities/EventTicketInfo";
import {PurchasedTicket, PurchasedTickets} from "../../entities/PurchasedTicket";
import { DsUser } from "../../entities/DsUser";
import { VideoStream, StreamType } from "../../types/VideoStream";
import { Pagination } from "../../types/Pagination";

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
@Query(() => PurchasedTickets, {nullable: true})
async purchasedTickets(@Arg("search", () => ID, { nullable: true }) ticketId?: string): Promise<PurchasedTickets> {
    console.debug(`args: ${JSON.stringify(ticketId)}`);

        let filters:any = {};
        if (ticketId) {
            filters = {
                id: ticketId,
            };
        }
        filters.purchaseTimeUtc = Not(IsNull());

        // filters.push({owner_id: "TODO bearer token"});
        console.debug(`filters: ${JSON.stringify(filters)}`);
        return new PurchasedTickets(await this.ticketRepo.find(
            {
                where: [filters]
            }
        ), new Pagination(1));
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
        const event = await this.eventRepo
        .createQueryBuilder("event")
        .select("event")
        .innerJoin(EventTicketInfo, "eti")
        .where("eti.id = :id", {id: ticket.ticketId})
        .getOne();

        if (!event) {
            throw new Error(`Event not found for EventTicketInfo: ${ticket.ticketId}`);
        }
        else {
            return event;
        }
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

    @FieldResolver(() => [VideoStream], {nullable: true})
    async replayStreams(@Root() _ticket: PurchasedTicket): Promise<VideoStream[]> {
        return [new VideoStream('TODO', StreamType.Primary)];
    }
    
    @FieldResolver()
    async purchasedAt(@Root() ticket: PurchasedTicket): Promise<Date>{
        return ticket.purchaseTimeUtc!;
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

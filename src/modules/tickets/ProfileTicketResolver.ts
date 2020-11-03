
import { Resolver, Mutation, Query, Ctx, Arg, FieldResolver, Root, ResolverInterface, ID, ObjectType } from "type-graphql";
import { Repository, IsNull, Not } from "typeorm";
import { GqlContext } from "../../types/GqlContext";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Event } from "../../entities/Event";
import { EventTicketInfo } from "../../entities/EventTicketInfo";
import { IProfileTicketQueryResult, IProfileTicketSearch, ProfileTicket, ProfileTickets, ProfileTicketStatus, ProfileTicketType, SearchProfileTicket } from "../../entities/ProfileTicket";
import { DsUser } from "../../entities/DsUser";
import { Pagination } from "../../types/Pagination";
import { TicketVoucher } from "../../entities/TicketVoucher";
import { Ticket } from "../../entities/Ticket";


@Resolver(() => ProfileTicket)
export class ProfileTicketResolver implements ResolverInterface<ProfileTicket> {  //implements ResolverInterface<Event>
    constructor(
        @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
        @InjectRepository(TicketVoucher) private readonly voucherRepo: Repository<TicketVoucher>,
        @InjectRepository(DsUser) private readonly userRepo: Repository<DsUser>,
        @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
        @InjectRepository(EventTicketInfo) private readonly eventTicketInfoRepo: Repository<EventTicketInfo>,
    ) {
    }

    //#region Queries and Mutations
    @Query(() => ProfileTickets, { nullable: true })
    async profileTickets(@Arg("search", () => SearchProfileTicket, { nullable: true }) search?: SearchProfileTicket): Promise<ProfileTickets> {
        console.debug(`args: ${JSON.stringify(search)}`);

        //TODO: user real bearer ID and pass search object rather than ID string to these two
        const userId = "cd6b69d6-8091-499b-96eb-31ca95761a89"; 
        const ticketSearch: IProfileTicketSearch = {
            userId: userId,
            search: search,
        }
        const tickets = await ProfileTicket.getOwnedTickets(this.ticketRepo, ticketSearch) || [];
        const vouchers = await ProfileTicket.getTicketVouchers(this.voucherRepo, ticketSearch) || [];
        const profileTickets = vouchers.concat(tickets);

        return new ProfileTickets(profileTickets, new Pagination(1));
    }
    //#endregion

    // #region Field Resolver implemenations
    @FieldResolver(() => ID)
    async id(@Root() ticket: IProfileTicketQueryResult): Promise<string> {
        return ticket.id;
    }

    @FieldResolver(() => DsUser, { nullable: true })
    async owner(@Root() ticket: IProfileTicketQueryResult): Promise<DsUser | undefined> {
        return this.userRepo.findOne(ticket.holderId);
    }

    @FieldResolver(() => DsUser)
    async purchaser(@Root() ticket: IProfileTicketQueryResult): Promise<DsUser> {
        return this.userRepo.findOneOrFail(ticket.purchaserId);
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
    async event(@Root() ticket: IProfileTicketQueryResult): Promise<Event> {
        return Event.getEventFromEventTicketInfoId(this.eventRepo, ticket.ticketInfoId);
    }

    @FieldResolver(() => EventTicketInfo)
    async eventTicket(@Root() ticket: IProfileTicketQueryResult): Promise<EventTicketInfo> {
        return this.eventTicketInfoRepo.findOneOrFail(ticket.ticketInfoId);
    }

    @FieldResolver(() => ID, {nullable: true})
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

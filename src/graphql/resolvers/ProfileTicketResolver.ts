
// import { Resolver, Query, Ctx, Arg, FieldResolver, Root, ResolverInterface, ID, UseMiddleware } from "type-graphql";
// import { GqlContext } from "../../types/GqlContext";
// import { Event } from "../../types/Event";
// import { EventTicketInfo } from "../../types/EventTicketInfo";
// import { IProfileTicketQueryResult, IProfileTicketSearch, ProfileTicket, ProfileTickets, ProfileTicketStatus, ProfileTicketType, SearchProfileTicket } from "../../types/ProfileTicket";
// import { DsUser } from "../../types/DsUser";
// import { Pagination } from "../../types/Pagination";
// import { TicketVoucher } from "../../types/TicketVoucher";
// import { Ticket } from "../../types/Ticket";
// import { IsLoggedIn } from "../../middleware/authChecker";


// @Resolver(() => ProfileTicket)
// export class ProfileTicketResolver implements ResolverInterface<ProfileTicket> {  //implements ResolverInterface<Event>

//     //#region Queries and Mutations
//     @Query(() => ProfileTickets, { nullable: true })
//     @UseMiddleware(IsLoggedIn)
//     async profileTickets(@Ctx() ctx: GqlContext, @Arg("search", () => SearchProfileTicket, { nullable: true }) search?: SearchProfileTicket): Promise<ProfileTickets> {
//         if (ctx.user) {
//             console.debug(`args: ${JSON.stringify(search)}`);

//             const ticketSearch: IProfileTicketSearch = {
//                 userCognitoId: ctx.user.sub,
//                 search: search,
//             }
//             const tickets = await ProfileTicket.getOwnedTickets(this.ticketRepo, ticketSearch) || [];
//             const vouchers = await ProfileTicket.getTicketVouchers(this.voucherRepo, ticketSearch) || [];
//             const profileTickets = vouchers.concat(tickets);

//             return new ProfileTickets(profileTickets, new Pagination(1));
//         } else {
//             return new ProfileTickets([], new Pagination(1));
//         }
//     }
//         //#endregion

//         // #region Field Resolver implemenations
//         @FieldResolver(() => ID)
//         async id(@Root() ticket: IProfileTicketQueryResult): Promise < string > {
//             return ticket.id;
//         }

//         @FieldResolver(() => DsUser, { nullable: true })
//         async owner(@Root() ticket: IProfileTicketQueryResult): Promise < DsUser | undefined > {
//             return this.userRepo.findOne(ticket.holderId);
//         }

//         @FieldResolver(() => DsUser)
//         async purchaser(@Root() ticket: IProfileTicketQueryResult): Promise < DsUser > {
//             return this.userRepo.findOneOrFail(ticket.purchaserId);
//         }

//         @FieldResolver(() => ProfileTicketType)
//         async ticketType(@Root() ticket: IProfileTicketQueryResult): Promise < ProfileTicketType > {
//             if(ticket.voucherId) {
//             return ProfileTicketType.Voucher;
//         }
//         return ProfileTicketType.Standard;
//     }

//     @FieldResolver(() => ProfileTicketStatus)
//     async ticketStatus(@Root() ticket: IProfileTicketQueryResult): Promise<ProfileTicketStatus> {
//         switch (ticket.status) {
//             case "Purchased":
//                 return ProfileTicketStatus.Purchased;
//             case "Refunded":
//                 return ProfileTicketStatus.Refunded;
//             case "Redeemed":
//                 return ProfileTicketStatus.Redeemed;
//             case "Assigned":
//                 return ProfileTicketStatus.Redeemed;
//             case "Created":
//                 return ProfileTicketStatus.Available;
//             case "Voided":
//                 return ProfileTicketStatus.Voided;
//             default:
//                 return ProfileTicketStatus.Unknown;
//         }
//     }

//     @FieldResolver(() => Event)
//     async event(@Root() ticket: IProfileTicketQueryResult): Promise<Event> {
//         return Event.getEventFromEventTicketInfoId(this.eventRepo, ticket.ticketInfoId);
//     }

//     @FieldResolver(() => EventTicketInfo)
//     async eventTicket(@Root() ticket: IProfileTicketQueryResult): Promise<EventTicketInfo> {
//         return this.eventTicketInfoRepo.findOneOrFail(ticket.ticketInfoId);
//     }

//     @FieldResolver(() => ID, { nullable: true })
//     async redemptionCode(@Root() ticket: IProfileTicketQueryResult): Promise<string | undefined> {
//         return Promise.resolve(ticket.redemptionCode);
//     }

//     @FieldResolver({ nullable: true })
//     async purchasedAt(@Root() ticket: IProfileTicketQueryResult): Promise<Date | undefined> {
//         return ticket.purchaseTimeUtc;
//     }
//     @FieldResolver()
//     async createdAt(@Root() ticket: IProfileTicketQueryResult): Promise<Date> {
//         return ticket.createdTimeUtc;
//     }
//     @FieldResolver()
//     async updatedAt(@Root() ticket: IProfileTicketQueryResult): Promise<Date> {
//         return ticket.lastUpdatedTimeUtc;
//     }
//     // #endregion
// }

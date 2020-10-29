
import { Resolver, Mutation, Query, Ctx, Arg, FieldResolver, Root, ResolverInterface } from "type-graphql";
import { Repository } from "typeorm";
import { GqlContext } from "../../types/GqlContext";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Ticket } from "../../entities/Ticket";

// @Resolver(() => PurchasedTicket)
// export class PurchasedTicketResolver implements ResolverInterface<Event> {  //implements ResolverInterface<Event>
//     private readonly genreTransformer: GenreTransformer;
//     constructor(
//         @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
//     ) {
//     }

//     //#region Queries and Mutations
//     @Query(() => PurchasedTickets)
//     async events(@Arg("search", { nullable: true }) eventSearch: TicketSearch): Promise<PurchasedTicket> {
//         console.debug(`args: ${JSON.stringify(eventSearch)}`);

//         const filters = [];
//         if (eventSearch) {
//             if (eventSearch.id) {
//                 filters.push({ id: eventSearch.id });
//             } if (eventSearch.name) {
//                 filters.push({ name: eventSearch.name });
//             } if (eventSearch.name) {
//                 filters.push({ slug: eventSearch.slug });
//             } if (eventSearch.genre) {
//                 const dbGenre = this.genreTransformer.to(eventSearch.genre);
//                 filters.push({ genreId: dbGenre });
//             } if (eventSearch.featured) {
//                 filters.push({ featured: eventSearch.featured });
//             }
//         }
//         console.debug(`filters: ${JSON.stringify(filters)}`);
//         return new Events(await this.eventRepo.find(
//             {
//                 where: filters,
//                 order: { startTimeUtc: "DESC" },
//             }
//         ));
//     }


    //#endregion

    //#region Field Resolver implemenations


    //#endregion
// }

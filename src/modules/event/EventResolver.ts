import { Event } from "../../entities/Event";
import { Venue } from "../../entities/Venue";
import { EventPerformer } from "../../entities/EventPerformer";
import { EventTicketInfo } from "../../entities/EventTicketInfo";
import { DbGenre, Genre, GenreTransformer } from "../../entities/Genre";
import { Merchandise } from "../../entities/Merchandise";
import { CreateEventInput, SearchEvent } from "./CreateEventInput";
import { Resolver, Mutation, Query, Ctx, Arg, FieldResolver, Root, ResolverInterface, UseMiddleware } from "type-graphql";
import { Repository } from "typeorm";
import { GqlContext } from "../../types/GqlContext";
import { InjectRepository } from "typeorm-typedi-extensions";
import { buildVideoStreams, StreamType, VideoStream } from "../../types/VideoStream";
import { Events } from "./Events";

@Resolver(() => Event)
export class EventResolver implements ResolverInterface<Event> {  //implements ResolverInterface<Event>
  private readonly genreTransformer: GenreTransformer;
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
    @InjectRepository(Venue) private readonly venueRepo: Repository<Venue>,
    @InjectRepository(DbGenre) private readonly genreRepo: Repository<DbGenre>,
    @InjectRepository(EventPerformer) private readonly eventPerformerRepo: Repository<EventPerformer>,
    @InjectRepository(EventTicketInfo) private readonly eventTicketInfoRepo: Repository<EventTicketInfo>,
    @InjectRepository(Merchandise) private readonly merchRepo: Repository<Merchandise>,
  ) {
    this.genreTransformer = new GenreTransformer();
  }

  //#region Queries and Mutations
  @Query(() => Events)
  async events(@Arg("search", { nullable: true }) eventSearch: SearchEvent): Promise<Events> {
    console.debug(`args: ${JSON.stringify(eventSearch)}`);

    const filters = [];
    if (eventSearch) {
      if (eventSearch.id) {
        filters.push({ id: eventSearch.id });
      } if (eventSearch.name) {
        filters.push({ name: eventSearch.name });
      } if (eventSearch.name) {
        filters.push({ slug: eventSearch.slug });
      } if (eventSearch.genre) {
        const dbGenre = this.genreTransformer.to(eventSearch.genre);
        filters.push({ genreId: dbGenre });
      } if (eventSearch.featured) {
        filters.push({ featured: eventSearch.featured });
      }
    }
    console.debug(`filters: ${JSON.stringify(filters)}`);
    return new Events(await this.eventRepo.find(
      {
        where: filters,
        order: { startTimeUtc: "DESC" },
      }
    ));
  }

  @Mutation(CreateEventInput => Event)
  addEvent(@Arg("event") _newEvent: CreateEventInput, @Ctx() _ctx: GqlContext): Promise<Event> {
    return new Promise(() => new Event());
  }

  //#endregion

  //#region Field Resolver implemenations

  @FieldResolver(() => Venue)
  async venue(@Root() event: Event): Promise<Venue> {
    return this.venueRepo.findOneOrFail(event.venueId);
  }

  @FieldResolver(() => Genre)
  async genre(@Root() event: Event): Promise<Genre> {
    return this.genreTransformer.from(event.genreId)
  }

  @FieldResolver(() => String)
  async genreDescription(@Root() event: Event): Promise<string | undefined> {
    return (await this.genreRepo.findOneOrFail(event.genreId)).name;
  }

  @FieldResolver(() => [EventPerformer])
  async performers(@Root() event: Event): Promise<EventPerformer[]> {
    return await this.eventPerformerRepo.createQueryBuilder("event_performer")
      .select("event_performer")
      .innerJoin("event_performer.event", "event")
      .where("event_performer.event_id = :id", { id: event.id })
      .getMany();
  }

  @FieldResolver(() => [VideoStream], { nullable: true })
  async promoVideos(@Root() e: Event): Promise<VideoStream[] | undefined> {
    console.error("resolving promo videos!")
    if (e.promoPlaybackIds) {
      console.error(`buliding videos: ${JSON.stringify(e.promoPlaybackIds)}`);
      return buildVideoStreams(e.promoPlaybackIds, StreamType.Promotional)
    }
    else {
      return undefined;
    }
  }

  @FieldResolver(() => [EventTicketInfo])
  async eventTickets(@Root() event: Event): Promise<EventTicketInfo[]> {
    return this.eventTicketInfoRepo.createQueryBuilder("eti")
      .select("eti")
      .innerJoin("eti.event", "event")
      .where("eti.eventId = :id", { id: event.id })
      .getMany();
  }

  @FieldResolver(() => [Merchandise])
  async merchandise(@Root() event: Event): Promise<Merchandise[]> {
    return this.merchRepo.createQueryBuilder("merch")
    .select("merch")
    .innerJoin("merch.event", "event")
    .where("merch.event_id = :id", {id: event.id})
    .getMany();
  }
  //#endregion
}

import { Event } from "../../entities/Event";
import { Venue } from "../../entities/Venue";
import { EventPerformer } from "../../entities/EventPerformer";
import { EventTicketInfo } from "../../entities/EventTicketInfo";
import { DbGenre, Genre, GenreTransformer } from "../../entities/Genre";
import { Merchandise } from "../../entities/Merchandise";
import { CreateEventInput } from "./CreateEventInput";
import { SearchEvent, SearchPerformer } from "../../types/Search";
import { Resolver, Mutation, Query, Ctx, Arg, FieldResolver, Root, ResolverInterface, Info } from "type-graphql";
import { Repository } from "typeorm";
import { GqlContext } from "../../types/GqlContext";
import { InjectRepository } from "typeorm-typedi-extensions";
import { buildVideoStreams, StreamType, VideoStream } from "../../types/VideoStream";
import { Events } from "./Events";
import { GraphQLResolveInfo } from "graphql";
import { DsUser } from "../../entities/DsUser";

@Resolver(() => Event)
export class EventResolver implements ResolverInterface<Event> {  
  private readonly genreTransformer: GenreTransformer;
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
    @InjectRepository(Venue) private readonly venueRepo: Repository<Venue>,
    @InjectRepository(DbGenre) private readonly genreRepo: Repository<DbGenre>,
    @InjectRepository(DsUser) private readonly userRepo: Repository<DsUser>,
    @InjectRepository(EventPerformer) private readonly eventPerformerRepo: Repository<EventPerformer>,
    @InjectRepository(EventTicketInfo) private readonly eventTicketInfoRepo: Repository<EventTicketInfo>,
    @InjectRepository(Merchandise) private readonly merchRepo: Repository<Merchandise>,
  ) {
    this.genreTransformer = new GenreTransformer();
  }

  //#region Queries and Mutations
  @Query(() => Events)
  async events(@Arg("search", { nullable: true }) eventSearch: SearchEvent, @Info() _info: GraphQLResolveInfo): Promise<Events> {
    console.debug(`args: ${JSON.stringify(eventSearch)}`);
    //TODO: do we want to use lookahead / info parsing to inspect the field values to filter up front?
    //https://www.npmjs.com/package/graphql-parse-resolve-info
    const filters: any = {};
    if (eventSearch) {
      if (eventSearch.id) {
        filters.id = eventSearch.id;
      } if (eventSearch.name) {
        filters.name = eventSearch.name;
      } if (eventSearch.name) {
        filters.slug = eventSearch.slug;
      } if (eventSearch.genre) {
        const dbGenre = this.genreTransformer.to(eventSearch.genre);
        filters.genreId = dbGenre;
      } if (eventSearch.featured) {
        filters.isFeatured = eventSearch.featured;
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
  async genreDescription(@Root() event: Event): Promise<string> {
    return (await this.genreRepo.findOneOrFail(event.genreId)).name;
  }

  @FieldResolver(() => DsUser)
  async owner(@Root() event: Event): Promise<DsUser | undefined> {
    return this.userRepo.findOne(event.ownerId);
  }

  @FieldResolver(() => [EventPerformer], { description: "search unimplemented" })
  async performers(@Root() event: Event, @Arg("search", {nullable: true}) _performers: SearchPerformer): Promise<EventPerformer[]> {
    return await this.eventPerformerRepo.createQueryBuilder("event_performer")
      .select("event_performer")
      .innerJoin("event_performer.event", "event")
      .where("event_performer.event_id = :id", { id: event.id })
      .getMany();
  }

  @FieldResolver(() => [VideoStream], { nullable: true })
  async promoVideos(@Root() e: Event): Promise<VideoStream[] | undefined> {
    if (e.promoPlaybackIds) {
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

  @FieldResolver(() => Date, { description: "search unimplemented"})
  async scheduledStartTime(@Root() event: Event, @Arg("search", () => Date, { nullable: true })  _startAfterTime: Date): Promise<Date|undefined> {
    return event.scheduledStartTimeUtc;
  }

  @FieldResolver(() => Date, { description: "search unimplemented" })
  async scheduledEndTime(@Root() event: Event, @Arg("search", () => Date, { nullable: true }) _endAfterTime: Date): Promise<Date | undefined> {
    return event.scheduledEndTimeUtc;
  }

  @FieldResolver(() => Date, { nullable: true, description: "search unimplemented" })
  async startedAt(@Root() event: Event, @Arg("search", () => Date, { nullable: true }) _startedAfterTime: Date): Promise<Date | undefined> {
    return event.startTimeUtc;
  }

  @FieldResolver(() => Date, { nullable: true, description: "search unimplemented" })
  async endedAt(@Root() event: Event, @Arg("search", () => Date, { nullable: true }) _endedBeforeTime: Date): Promise<Date | undefined> {
    return event.startTimeUtc;
  }
  //#endregion
}

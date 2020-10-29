import { Event } from "../../entities/Event";
import { Venue } from "../../entities/Venue";
import { EventPerformer } from "../../entities/EventPerformer";
import { Performer } from "../../entities/Performer";
import { EventTicketInfo } from "../../entities/EventTicketInfo";
import { DbGenre, Genre, GenreTransformer } from "../../entities/Genre";
import { TicketClass, TicketClassTransformer } from "../../entities/TicketClass";
import { Merchandise } from "../../entities/Merchandise";
import { CreateEventInput, SearchEvent } from "./CreateEventInput";
import { Resolver, Mutation, Query, Ctx, Arg, Int, ObjectType, Field, FieldResolver, Root, ResolverInterface } from "type-graphql";
import { Repository } from "typeorm";
import { Context } from "../../Context";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Money } from "./Money";
import { buildVideoStreams, StreamType, VideoStream } from "./VideoStream";
import e from "express";
import { EEXIST } from "constants";

//setting Field properties for arrays:
//nullable: "items" for [Item]! 
//nullable: "itemsAndList" for the [Item]
//nullable: "list" for [item!]

//we should use relay style pagination rather than this structure
@ObjectType()
class Pagination {

  constructor(page: number, previous?: number, next?: number) {
    this.previousPage = previous;
    this.page = page;
    this.nextPage = next;
  }

  @Field(() => Int, { nullable: true })
  previousPage?: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int, { nullable: true})
  nextPage?: number;
}

@ObjectType()
class Events {
  constructor(events: Event[]
  ) {
    this.matching = events;
    this.pagination = new Pagination(1);
  }

  @Field(() => [Event])
  matching: Event[]

  @Field(() => Pagination)
  pagination: Pagination;
}

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

  @Mutation(CreateEventInput => Event)
  addEvent(@Arg("event") _newEvent: CreateEventInput, @Ctx() _ctx: Context): Promise<Event> {
    return new Promise(() => new Event());
  }

}

@Resolver(() => EventPerformer)
export class EventPerformerResolver implements ResolverInterface<EventPerformer> {  //implements ResolverInterface<Event>
  constructor(
    @InjectRepository(Performer) private readonly performerRepository: Repository<Performer>,
  ) { }

  @FieldResolver(() => Performer)
  async performer(@Root() eventPerformer: EventPerformer): Promise<Performer> {
    return this.performerRepository.findOneOrFail(eventPerformer.performerId);
  }
}

//TODO: why are none of these resolving!?
@Resolver(() => EventTicketInfo)
export class EventTicketResolver {
  private readonly ticketClassTransformer: TicketClassTransformer;

  constructor(
    @InjectRepository(EventTicketInfo) private readonly eventTicketInfoRepo: Repository<EventTicketInfo>,
  ) {
    this.ticketClassTransformer = new TicketClassTransformer();
  }

  @FieldResolver(() => TicketClass)
  async ticketClass(@Root() eti: EventTicketInfo): Promise<TicketClass> {
    console.error('Here we are!');
    const ticketClass = this.ticketClassTransformer.from(eti.ticketClassId);
    return ticketClass;

  }
  @FieldResolver(() => Int, { nullable: true })
  async available(@Root() _eti: EventTicketInfo): Promise<number | undefined> {
    //TODO: this needs to do something
    return undefined;
  }

  @FieldResolver(() => Int)
  async ticketsSold(@Root() eti: EventTicketInfo): Promise<number> {
    //TODO: Unauthorized unless admin! Also doesn't work 
    return await this.eventTicketInfoRepo.createQueryBuilder("eti")
      .select("coalesce(count(t.id),0)", "soldCnt")
      .leftJoin("ticket", "t", "t.ticket_id = eti.id")
      .where("t.purchase_time_utc IS NOT NULL")
      .andWhere("NOT eti.is_deleted")
      .andWhere("NOT t.is_deleted")
      .andWhere("eti.id = :id", { id: eti.id })
      .groupBy("eti.id")
      .getRawOne();
  }

  @FieldResolver(() => Money)
  async price(@Root() eti: EventTicketInfo): Promise<Money> {
    return new Money(eti.currencyCode, eti.priceInCents);
  }
}
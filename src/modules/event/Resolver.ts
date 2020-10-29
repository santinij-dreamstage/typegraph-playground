import { Event } from "../../entities/Event";
import { Venue } from "../../entities/Venue";
import { EventPerformer } from "../../entities/EventPerformer";
import { Performer } from "../../entities/Performer";
import { EventStatus, EventStatusTransformer } from "../../entities/EventStatus";
import { EventTicketInfo } from "../..//entities/EventTicketInfo";
import { DbGenre, Genre, GenreTransformer } from "../../entities/Genre";
import { CreateEventInput, SearchEvent } from "./CreateEventInput";
import { Resolver, Mutation, Query, Ctx, Arg, Int, ObjectType, Field, FieldResolver, Root, ResolverInterface } from "type-graphql";
import { Repository } from "typeorm";
import { Context } from "src/Context";
import { InjectRepository } from "typeorm-typedi-extensions";
import { DbTicketClass, TicketClass, TicketClassTransformer } from "../../entities/TicketClass";


@ObjectType()
class Events {
  constructor(events: Event[]
  ) {
    this.matching = events;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  @Field(() => [Event!]!)
  matching: Event[]
}

@Resolver(() => Event)
export class EventResolver {  //implements ResolverInterface<Event>
  private readonly genreTransformer: GenreTransformer;
  private readonly eventStatusTransformer: EventStatusTransformer;
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
    @InjectRepository(Venue) private readonly venueRepo: Repository<Venue>,
    @InjectRepository(DbGenre) private readonly genreRepo: Repository<DbGenre>,
    @InjectRepository(EventPerformer) private readonly eventPerformerRepo: Repository<EventPerformer>,
    @InjectRepository(EventTicketInfo) private readonly eventTicketInfoRepo: Repository<EventTicketInfo>,
  ) {
    this.eventStatusTransformer = new EventStatusTransformer();
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
  async genreDescription(@Root() event: Event): Promise<string> {
    return (await this.genreRepo.findOneOrFail(event.genreId)).name;
  }

  @FieldResolver(() => EventStatus)
  async status(@Root() event: Event): Promise<EventStatus> {
    return this.eventStatusTransformer.from(event.eventStatusId)
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  @FieldResolver(() => [EventPerformer!]!)
  async performers(@Root() event: Event): Promise<EventPerformer[]> {
    return await this.eventPerformerRepo.createQueryBuilder("event_performer")
      .select("event_performer")
      .innerJoin("event_performer.event", "event")
      .where("event_performer.event_id = :id", { id: event.id })
      .getMany();
  }


  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  @FieldResolver(() => [EventTicketInfo!]!)
  async eventTickets(@Root() event: Event): Promise<EventTicketInfo[]> {
    return this.eventTicketInfoRepo.createQueryBuilder("eti")
      .select("eti")
      .innerJoin("eti.event", "event")
      .where("eti.eventId = :id", { id: event.id })
      .getMany();
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unused-vars
  @Mutation(CreateEventInput => Event!)
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

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  @FieldResolver(() => TicketClass!)
  async ticketClass(@Root() eti: EventTicketInfo): Promise<TicketClass> {
    console.error('Here we are!');
    const ticketClass = this.ticketClassTransformer.from(eti.ticketClassId);
    return ticketClass;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  @FieldResolver(() => Int!)
  async available(@Root() eti: EventTicketInfo): Promise<number> {
    return 0;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  @FieldResolver(() => Int!)
  async ticketsSold(@Root() eti: EventTicketInfo): Promise<number> {
    //TODO: Unauthorized unless admin!
    const { sold } = await this.eventTicketInfoRepo.createQueryBuilder("eti")
      .select("coalesce(count(t.id),0)", "soldCnt")
      .leftJoin("ticket", "t", "t.ticket_id = eti.id")
      .where("t.purchase_time_utc IS NOT NULL")
      .andWhere("NOT eti.is_deleted")
      .andWhere("NOT t.is_deleted")
      .andWhere("eti.id = :id", {id: eti.id})
      .groupBy("eti.id")
      .getRawOne();
    return sold || 0;
  }
  
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  @FieldResolver(() => Money!)
  async price(@Root() eti: EventTicketInfo): Promise<Money> {
    return new Money(eti.currencyCode, eti.priceInCents);
  }
}

@ObjectType()
export class Money {
  constructor(currency: string, value: number) {
    this.currency = currency;
    this.valueInCents = value;
  }

  @Field()
  currency: string;

  @Field(() => Int)
  valueInCents: number
}
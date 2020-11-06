import { Event } from "../types/Event";
import { Events } from "../types/Events";
import { Venue } from "../types/Venue";
import { Genre, GenreTransformer } from "../types/Genre";
import { SearchEvent, SearchPerformer } from "../input/Search";
import { Resolver, Query, Ctx, Arg, FieldResolver, Root, Info, ResolverInterface, ID } from "type-graphql";
import { GqlContext } from "../GqlContext";
import { GraphQLResolveInfo } from "graphql";
import { venue as DbVenue, event as DbEvent, eventWhereInput } from "@prisma/client";
import { EventStatus, EventStatusTransformer } from "../types/EventStatus";
import { GraphQLURL } from "graphql-custom-types";
import { IsUrl } from "class-validator";
import { EventTicket } from "../types/EventTicket";
import { Merchandise } from "../types/Merchandise";
import { buildVideoStreams, StreamType, VideoStream } from "../types/VideoStream";
import { EventPerformer } from "../types/EventPerformer";
import { ds_user as DbUser, event_performer as DbEventPerformer, event_ticket_info as DbEventTicketInfo, merchandise as DbMerchandise } from "@prisma/client";
import { DsUser } from "../types/DsUser";

@Resolver(() => Event)
export class EventResolver { //implements ResolverInterface<Event> {
  private readonly genreTransformer: GenreTransformer;
  private readonly eventStatusTransformer: EventStatusTransformer;

  constructor(
  ) {
    this.genreTransformer = new GenreTransformer();
    this.eventStatusTransformer = new EventStatusTransformer();
  }

  //#region Queries and Mutations
  @Query(() => Events)
  async events(@Ctx() { prisma }: GqlContext, @Arg("search", { nullable: true }) eventSearch: SearchEvent, @Info() _info: GraphQLResolveInfo): Promise<Events> {
    console.debug(`args: ${JSON.stringify(eventSearch)}`);
    //TODO: do we want to use lookahead / info parsing to inspect the field values to filter up front?
    //https://www.npmjs.com/package/graphql-parse-resolve-info
    const filters: eventWhereInput[] = [];
    if (eventSearch) {
      if (eventSearch.id) {
        filters.push({ id: eventSearch.id });
      } if (eventSearch.name) {
        filters.push({ name: eventSearch.name });
      } if (eventSearch.name) {
        filters.push({ slug: eventSearch.slug });
      } if (eventSearch.genre) {
        const dbGenre = this.genreTransformer.to(eventSearch.genre);
        filters.push({ genre: dbGenre });
      } if (eventSearch.featured) {
        filters.push({ is_featured: eventSearch.featured });
      }
    }

    console.debug(`filters: ${JSON.stringify(filters)}`);
    const events = await prisma.event.findMany({
      where: { AND: filters },
      orderBy: [{
        scheduled_end_time_utc: 'desc'
      }]
    }
    );
    return new Events(events);
  }

  // @Mutation(CreateEventInput => Event)
  // addEvent(@Arg("event") _newEvent: CreateEventInput, @Ctx() _ctx: GqlContext): Promise<Event> {
  //   return new Promise(() => new Event());
  // }

  //#endregion

  //#region Field Resolver implemenations

  @FieldResolver(() => ID)
  async id(@Root() event: DbEvent): Promise<string> {
    return event.id;
  }

  @FieldResolver()
  async name(@Root() event: DbEvent): Promise<string> {
    return event.name;
  }

  @FieldResolver({ nullable: true })
  async description(@Root() event: DbEvent): Promise<string | null> {
    return event.description;
  }

  @FieldResolver()
  async isFeatured(@Root() event: DbEvent): Promise<boolean> {
    return event.is_featured;
  }

  @FieldResolver(() => [String], { nullable: true })
  async tags(@Root() event: DbEvent): Promise<string[] | undefined> {
    return event.tags;
  }

  @FieldResolver(() => Genre)
  async genre(@Root() event: DbEvent): Promise<Genre> {
    return this.genreTransformer.from(event.genre)
  }

  @FieldResolver(() => String)
  async genreDescription(@Root() event: DbEvent, @Ctx() { prisma }: GqlContext): Promise<string> {
    const genre = await prisma.genre.findOne({
      where: { id: event.genre }
    });
    if (!genre || !genre.name) {
      throw new Error(`genre is missing name: ${genre?.id}`);
    }
    else {
      return genre.name;
    }
  }

  @FieldResolver(() => DsUser)
  async owner(@Root() event: DbEvent, @Ctx() { prisma }: GqlContext): Promise<DbUser | null> {
    return prisma.ds_user.findOne({
      where: { id: event.owner_id }
    });
  }

  @FieldResolver(() => Venue)
  async venue(@Root() event: DbEvent, @Ctx() { prisma }: GqlContext): Promise<DbVenue> {
    const venue = await prisma.event.findOne({
      where: { id: event.id }
    }).venue();

    if (!venue) {
      throw new Error(`Venue missing for event: ${event.id}`);
    }
    return venue;
  }

  @FieldResolver(() => [EventPerformer], { description: "search unimplemented" })
  async performers(@Root() event: DbEvent, @Ctx() { prisma }: GqlContext, @Arg("search", { nullable: true }) _performers: SearchPerformer): Promise<DbEventPerformer[]> {
    return prisma.event_performer.findMany(
      {
        where: { event_id: event.id }
      }
    )
  }

  @FieldResolver(() => [VideoStream], { nullable: true })
  async promoVideos(@Root() e: DbEvent): Promise<VideoStream[] | undefined> {
    if (e.promo_playback_ids) {
      return buildVideoStreams(e.promo_playback_ids, StreamType.Promotional)
    }
    else {
      return undefined;
    }
  }

  @FieldResolver(() => [EventTicket])
  async eventTickets(@Root() event: DbEvent, @Ctx() { prisma }: GqlContext): Promise<DbEventTicketInfo[]> {
    return await prisma.event_ticket_info.findMany({
      where: { event_id: event.id }
    });
  }

  @FieldResolver(() => [Merchandise])
  async merchandise(@Root() event: DbEvent, @Ctx() { prisma }: GqlContext): Promise<DbMerchandise[]> {
    return await prisma.merchandise.findMany({
      where: { event_id: event.id }
    });
  }

  @FieldResolver(() => Date, { description: "search unimplemented" })
  async publishedAt(@Root() event: DbEvent): Promise<Date | null> {
    return event.published_time_utc;
  }

  @FieldResolver(() => Date, { description: "search unimplemented" })
  async scheduledStartTime(@Root() event: DbEvent, @Arg("search", () => Date, { nullable: true }) _startAfterTime: Date): Promise<Date> {
    return event.scheduled_start_time_utc;
  }

  @FieldResolver(() => Date, { description: "search unimplemented" })
  async scheduledEndTime(@Root() event: DbEvent, @Arg("search", () => Date, { nullable: true }) _endAfterTime: Date): Promise<Date> {
    return event.scheduled_end_time_utc;
  }

  @FieldResolver(() => Date, { nullable: true, description: "search unimplemented" })
  async startedAt(@Root() event: DbEvent, @Arg("search", () => Date, { nullable: true }) _startedAfterTime: Date): Promise<Date | null> {
    return event.start_time_utc;
  }

  @FieldResolver(() => Date, { nullable: true, description: "search unimplemented" })
  async endedAt(@Root() event: DbEvent, @Arg("search", () => Date, { nullable: true }) _endedBeforeTime: Date): Promise<Date | null> {
    return event.end_time_utc;
  }

  @FieldResolver(() => Date, { nullable: true, description: "search unimplemented" })
  async canceledAt(@Root() event: DbEvent): Promise<Date | null> {
    return event.canceled_time_utc;
  }

  @FieldResolver(() => EventStatus)
  async status(@Root() event: DbEvent): Promise<EventStatus> {
    return this.eventStatusTransformer.from(event.event_status_id);
  }

  @FieldResolver({ nullable: true })
  async ageRestriction(@Root() event: DbEvent): Promise<number | null> {
    return event.age_restriction;
  }

  @FieldResolver(() => GraphQLURL, { nullable: true })
  @IsUrl()
  async posterImageUrl(@Root() event: DbEvent): Promise<string | null> {
    return event.poster_image_url;
  }

  @FieldResolver(() => GraphQLURL, { nullable: true })
  @IsUrl()
  async heroImageUrl(@Root() event: DbEvent): Promise<string | null> {
    return event.hero_image_url;
  }

  @FieldResolver(() => GraphQLURL, { nullable: true })
  @IsUrl()
  async merchandiseStoreUrl(@Root() event: DbEvent): Promise<string | null> {
    return event.merchandise_store_url;
  }

  @FieldResolver(() => GraphQLURL, { nullable: true })
  @IsUrl()
  async socialImageUrl(@Root() event: DbEvent): Promise<string | null> {
    return event.social_image_url;
  }

  @FieldResolver({ nullable: true })
  @IsUrl()
  async hashtag(@Root() event: DbEvent): Promise<string | null> {
    return event.hashtag;
  }

  @FieldResolver(() => GraphQLURL, { nullable: true })
  @IsUrl()
  async ticketArtworkUrl(@Root() event: DbEvent): Promise<string | null> {
    return event.ticket_artwork_url;
  }

  @FieldResolver(() => [GraphQLURL], { nullable: true })
  async featuredPosterUrls(@Root() event: DbEvent): Promise<string[] | undefined> {
    return event.featured_poster_urls;
  }

  @FieldResolver({ nullable: true })
  async slug(@Root() event: DbEvent): Promise<string | null> {
    return event.slug;
  }

  @FieldResolver({ nullable: true })
  async shortDescription(@Root() event: DbEvent): Promise<string | null> {
    return event.short_description;
  }

  @FieldResolver({ nullable: true })
  async socialDescription(@Root() event: DbEvent): Promise<string | null> {
    return event.social_description;
  }

  @FieldResolver({ nullable: true })
  async showEndMessage(@Root() event: DbEvent): Promise<string | null> {
    return event.show_end_message;
  }

  @FieldResolver({ nullable: true })
  async backgroundColor(@Root() event: DbEvent): Promise<string | null> {
    return event.background_color;
  }

  @FieldResolver({ nullable: true })
  async accentColor(@Root() event: DbEvent): Promise<string | null> {
    return event.accent_color;
  }

  @FieldResolver()
  async enableWatermark(@Root() event: DbEvent): Promise<boolean> {
    return event.enable_watermark;
  }

  @FieldResolver(() => Date,)
  async createdAt(@Root() event: DbEvent): Promise<Date> {
    return event.created_time_utc;
  }

  @FieldResolver(() => Date,)
  async updatedAt(@Root() event: DbEvent): Promise<Date> {
    return event.last_updated_time_utc;
  }
  //#endregion
}

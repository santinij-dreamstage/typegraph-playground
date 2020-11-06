
import { EventStatus } from "./EventStatus";
import { Genre } from "./Genre";
import { DsUser } from "./DsUser";
import { Venue } from "./Venue";
import { EventPerformer } from "./EventPerformer";
import { EventTicket } from "./EventTicket";
import { Merchandise } from "./Merchandise";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { IsUrl } from "class-validator";
import { GraphQLURL } from "graphql-custom-types"
import { VideoStream } from "./VideoStream";


@ObjectType()
export class Event {

  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ name: "featured" })
  isFeatured: boolean;

  @Field(() => [String], { nullable: true })
  tags?: string[];
  
  @Field(() => Genre)
  genre: Genre;

  @Field(() => DsUser, { nullable: true })
  owner?: DsUser;

  @Field(() => Venue, { name: "venue" })
  venue: Venue;

  @Field()
  genreDescription: string;

  @Field(() => [EventPerformer])
  performers: EventPerformer[]

  @Field(() => [VideoStream], { nullable: true })
  promoVideos?: VideoStream[]

  @Field(() => [EventTicket])
  eventTickets: EventTicket[];

  @Field(() => [Merchandise])
  merchandise: Merchandise[];

  @Field({ nullable: true })
  publishedAt?: Date;

  @Field({ name: "scheduledStartTime" })
  scheduledStartTimeUtc: Date;

  @Field({ name: "scheduledEndTime" })
  scheduledEndTimeUtc: Date;

  @Field({ nullable: true, name: "startedAt" })
  startTimeUtc?: Date;

  @Field({ nullable: true, name: "endedAt" })
  endTimeUtc?: Date;

  @Field({ nullable: true, name: "canceledAt" })
  canceledTimeUtc?: Date;

  @Field(() => EventStatus, { name: "status" })
  eventStatusId: number;

  @Field(() => Int, { nullable: true })
  ageRestriction?: number;

  @Field(() => GraphQLURL, { nullable: true })
  @IsUrl()
  posterImageUrl?: string;

  @Field(() => GraphQLURL, { nullable: true })
  @IsUrl()
  heroImageUrl?: string;

  @Field(() => GraphQLURL, { nullable: true })
  @IsUrl()
  merchandiseStoreUrl?: string;

  @Field({ name: "createdAt" })
  createdTimeUtc: Date;

  @Field({ name: "updatedAt" })
  lastUpdatedTimeUtc: Date;

  @Field(() => GraphQLURL, { nullable: true })
  @IsUrl()
  socialImageUrl?: string;

  @Field({ nullable: true })
  hashtag?: string;

  @Field(() => GraphQLURL, { nullable: true })
  @IsUrl()
  ticketArtworkUrl?: string;

  @Field(() => [GraphQLURL], { nullable: true })
  // @IsUrl()
  featuredPosterUrls?: string[];

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  shortDescription?: string;

  @Field({ nullable: true })
  socialDescription?: string;

  @Field({ nullable: true })
  showEndMessage?: string;

  @Field({ nullable: true })
  backgroundColor?: string;

  @Field({ nullable: true })
  accentColor?: string;

  @Field()
  enableWatermark: boolean;
}

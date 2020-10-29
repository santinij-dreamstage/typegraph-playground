import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from "typeorm";
import { BookmarkedEvent } from "./BookmarkedEvent";
import { DbEventStatus } from "./EventStatus";
import { DbGenre } from "./Genre";
import { DsUser } from "./DsUser";
import { Venue } from "./Venue";
import { EventPerformer } from "./EventPerformer";
import { EventTicketInfo } from "./EventTicketInfo";
import { Merchandise } from "./Merchandise";
import { ReminderRecipient } from "./ReminderRecipient";
import { ReminderTimes } from "./ReminderTimes";
import { Field, ID, ObjectType } from "type-graphql";
import { IsUrl } from "class-validator";
import { GraphQLURL } from "graphql-custom-types"


@Index(
  "event_start_time_utc_end_time_utc_idx",
  ["endTimeUtc", "startTimeUtc"],
  {}
)
@Index("event_pkey", ["id"], { unique: true })
@Index(
  "event_scheduled_start_time_utc_scheduled_end_time_utc_idx",
  ["scheduledEndTimeUtc", "scheduledStartTimeUtc"],
  {}
)
@Index("unique_website_slug", ["slug"], { unique: true })
@Index("event_venue_id_idx", ["venueId"], {})
@ObjectType()
@Entity("event", { schema: "public" })
export class Event extends BaseEntity {
  @Field(() => ID)
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Field()
  @Column("text", { name: "name" })
  name: string;

  @Field({ nullable: true })
  @Column("text", { name: "description", nullable: true })
  description?: string;

  @Field({name: "featured"})
  @Column("boolean", { name: "is_featured", default: () => "false" })
  isFeatured: boolean;
  
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  @Field(() => [String!], { nullable: true }) 
  @Column("text", { name: "tags", nullable: true, array: true })
  tags?: string[];

  @Field({ nullable: true, name: "publishedAt" })
  @Column("timestamp with time zone", {
    name: "published_time_utc",
    nullable: true,
  })
  publishedTimeUtc?: Date;

  @Field({ name: "scheduledStartTime" })
  @Column("timestamp with time zone", { name: "scheduled_start_time_utc" })
  scheduledStartTimeUtc: Date;

  @Field({ name: "scheduledEndTime" })
  @Column("timestamp with time zone", { name: "scheduled_end_time_utc" })
  scheduledEndTimeUtc: Date;

  @Field({ nullable: true, name: "startedAt" })
  @Column("timestamp with time zone", {
    name: "start_time_utc",
    nullable: true,
  })
  startTimeUtc?: Date;

  @Field({ nullable: true, name: "endedAt" })
  @Column("timestamp with time zone", { name: "end_time_utc", nullable: true })
  endTimeUtc?: Date;

 @Field({ nullable: true, name: "canceledAt" })
 @Column("timestamp with time zone", {
    name: "canceled_time_utc",
    nullable: true,
  })
  canceledTimeUtc?: Date;

  @Column("uuid", { name: "venue_id" })
  venueId: string;

  @Column("integer", { name: "genre" })
  genreId: number;

  @Column("integer", { name: "event_status_id" })
  eventStatusId: number;

  @Field({ nullable: true})
  @Column("integer", { name: "age_restriction", nullable: true })
  ageRestriction?: number;

  @Field(() => GraphQLURL, { nullable: true })
  @IsUrl()
  @Column("text", { name: "poster_image_url", nullable: true })
  posterImageUrl?: string;

  @Field(() => GraphQLURL, { nullable: true })
  @IsUrl()
  @Column("text", { name: "hero_image_url", nullable: true })
  heroImageUrl?: string;

  @Column("text", { name: "stream_key", nullable: true })
  streamKey?: string;

  @Column("text", { name: "playback_id", nullable: true })
  playbackId?: string;

  @Column("text", { name: "replay_id", nullable: true })
  replayId?: string;

  @Column("text", { name: "asset_id", nullable: true })
  assetId?: string;

  @Field(() => GraphQLURL, { nullable: true })
  @IsUrl()
  @Column("text", { name: "merchandise_store_url", nullable: true })
  merchandiseStoreUrl?: string;

  @Column("text", { name: "promo_playback_ids", nullable: true, array: true })
  promoPlaybackIds?: string[];

  @Field({ nullable: true, name: "createdAt" })
  @Column("timestamp with time zone", {
    name: "created_time_utc",
    default: () => "timezone('utc', now())",
  })
  createdTimeUtc: Date;

  @Field({ nullable: true, name: "updatedAt" })
  @UpdateDateColumn({ type: "timestamptz", name: "last_updated_time_utc" })
  lastUpdatedTimeUtc: Date;

  @Field(() => GraphQLURL, { nullable: true })
  @IsUrl()
  @Column("text", { name: "social_image_url", nullable: true })
  socialImageUrl?: string;

  @Column("text", { name: "hashtag", nullable: true })
  hashtag?: string;

  @Field(() => GraphQLURL, { nullable: true })
  @IsUrl()
  @Column("text", { name: "ticket_artwork_url", nullable: true })
  ticketArtworkUrl?: string;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  @Field(() => [GraphQLURL!], { nullable: true })
  // @IsUrl()
  @Column("text", { name: "featured_poster_urls", nullable: true, array: true })
  featuredPosterUrls?: string[];

  @Field({ nullable: true })
  @Column("text", { name: "slug", nullable: true, unique: true })
  slug?: string;

  @Field({ nullable: true })
  @Column("text", { name: "short_description", nullable: true })
  shortDescription?: string;

  @Field({ nullable: true })
  @Column("text", { name: "social_description", nullable: true })
  socialDescription?: string;

  @Field({ nullable: true })
  @Column("text", { name: "show_end_message", nullable: true })
  showEndMessage?: string;

  @Field({ nullable: true })
  @Column("text", { name: "background_color", nullable: true })
  backgroundColor?: string;

  @Field({ nullable: true })
  @Column("text", { name: "accent_color", nullable: true })
  accentColor?: string;

  @Field()
  @Column("boolean", { name: "enable_watermark", default: () => "true" })
  enableWatermark: boolean;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;

  @OneToMany(() => BookmarkedEvent, (bookmarkedEvent) => bookmarkedEvent.event)
  bookmarkedEvents: BookmarkedEvent[];

  @ManyToOne(() => DbEventStatus, (eventStatus) => eventStatus.events)
  @JoinColumn([
    { name: "event_status_id", referencedColumnName: "eventStatusId" },
  ])
  eventStatus: DbEventStatus;

  @ManyToOne(() => DbGenre, (genre) => genre)
  @JoinColumn([{ name: "genre", referencedColumnName: "id" }])
  genre: DbGenre;

  @ManyToOne(() => DsUser, (dsUser) => dsUser.events)
  @JoinColumn([{ name: "owner_id", referencedColumnName: "id" }])
  owner: DsUser;

  @ManyToOne(() => Venue, (venue) => venue.events)
  @JoinColumn([{ name: "venue_id", referencedColumnName: "id" }])
  venue: Venue;

  @OneToMany(() => EventPerformer, (eventPerformer) => eventPerformer.event)
  eventPerformers: EventPerformer[];

  @OneToMany(() => EventTicketInfo, (eventTicketInfo) => eventTicketInfo.event)
  eventTicketInfos: EventTicketInfo[];

  @OneToMany(() => Merchandise, (merchandise) => merchandise.event)
  merchandises: Merchandise[];

  @OneToMany(
    () => ReminderRecipient,
    (reminderRecipient) => reminderRecipient.event
  )
  reminderRecipients: ReminderRecipient[];

  @OneToOne(() => ReminderTimes, (reminderTimes) => reminderTimes.event)
  reminderTimes: ReminderTimes;
}

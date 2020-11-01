import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { Event } from "./Event";
import { Performer } from "./Performer";

@Index(
  "event_performer_performer_id_event_id_idx",
  ["eventId", "performerId"],
  {}
)
@Index("event_performer_akey1", ["eventId", "performerId"], { unique: true })
@Index("event_performer_pkey", ["id"], { unique: true })
@Entity("event_performer", { schema: "public" })
@ObjectType()
export class EventPerformer extends BaseEntity {

  @Field(() => ID)
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "performer_id", unique: true })
  performerId: string;

  @Column("uuid", { name: "event_id", unique: true })
  eventId: string;

  @Field()
  @Column("boolean", {
    name: "is_sound_check_complete",
    default: () => "false",
  })
  isSoundCheckComplete: boolean;

  @Field()
  @Column("boolean", { name: "is_invite_accepted", default: () => "false" })
  isInviteAccepted: boolean;

  @Field()
  @Column("boolean", { name: "is_invite_sent", default: () => "false" })
  isInviteSent: boolean;

  
  @Field({ name: "createdAt" })
  @Column("timestamp with time zone", {
    name: "created_time_utc",
    default: () => "timezone('utc', now())",
  })
  createdTimeUtc: Date;

  @Field({ name: "updatedAt" })
  @UpdateDateColumn({ type: "timestamptz", name: "last_updated_time_utc", default: () => "timezone('utc', now())", })
  lastUpdatedTimeUtc: Date;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;

  @ManyToOne(() => Event, (event) => event.eventPerformers)
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;

  @ManyToOne(() => Performer, (performer) => performer.eventPerformers)
  @JoinColumn([{ name: "performer_id", referencedColumnName: "id" }])
  performer: Performer;
}

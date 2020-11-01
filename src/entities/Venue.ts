import { ObjectType, Field, ID } from "type-graphql";
import { BaseEntity, Column, Entity, Index, OneToMany, UpdateDateColumn } from "typeorm";
import { Event } from "./Event";

@Index("venue_pkey", ["id"], { unique: true })
@ObjectType()
@Entity("venue", { schema: "public" })
export class Venue extends BaseEntity {
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

  @Field()
  @Column("boolean", { name: "is_open", default: () => "false" })
  isOpen: boolean;

  @Field({ nullable: true, name: "createdAt" })
  @Column("timestamp with time zone", {
    name: "created_time_utc",
    default: () => "timezone('utc', now())",
  })
  createdTimeUtc: Date;

  @Field({ nullable: true, name: "updatedAt" })
  @UpdateDateColumn({ type: "timestamptz", name: "last_updated_time_utc", default: () => "timezone('utc', now())", })
  lastUpdatedTimeUtc: Date;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;

  @OneToMany(() => Event, (event) => event.venue)
  events: Event[];
}

import { GraphQLURL } from "graphql-custom-types";
import { Money } from "../types/Money";
import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Event } from "./Event";

@Index("merchandise_pkey", ["id"], { unique: true })
@ObjectType()
@Entity("merchandise", { schema: "public" })
export class Merchandise {

  @Field(() => Money)
  price(): Money {
    return new Money(this.currencyCode, this.priceInCents);
  }

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

  @Field()
  @Column("text", { name: "description" })
  description: string;

  @Field(() => GraphQLURL)
  @Column("text", { name: "thumbnail_url" })
  thumbnailUrl: string;

  @Field(() => GraphQLURL)
  @Column("text", { name: "expanded_image_url" })
  expandedImageUrl: string;

  @Field()
  @Column("boolean", { name: "contains_clothing" })
  containsClothing: boolean;

  @Column("integer", { name: "price_in_cents" })
  priceInCents: number;

  @Column("text", { name: "currency_code" })
  currencyCode: string;

  @Column("timestamp with time zone", {
    name: "created_time_utc",
    default: () => "timezone('utc', now())",
  })
  createdTimeUtc: Date;

  @Column("timestamp with time zone", {
    name: "last_updated_time_utc",
    default: () => "timezone('utc', now())",
  })
  lastUpdatedTimeUtc: Date;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;

  @ManyToOne(() => Event, (event) => event.merchandises)
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;
}

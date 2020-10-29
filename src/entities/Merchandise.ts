import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Event } from "./Event";

@Index("merchandise_pkey", ["id"], { unique: true })
@Entity("merchandise", { schema: "public" })
export class Merchandise {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("text", { name: "name" })
  name: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("text", { name: "thumbnail_url" })
  thumbnailUrl: string;

  @Column("text", { name: "expanded_image_url" })
  expandedImageUrl: string;

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

import { Column, Entity, Index, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { Event } from "./Event";
import { DsUser } from "./DsUser";

@Index("bookmarked_event_user_id_event_id_idx", ["eventId", "userId"], {})
@Index("bookmarked_event_pkey", ["id"], { unique: true })
@Entity("bookmarked_event", { schema: "public" })
export class BookmarkedEvent {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "user_id" })
  userId: string;

  @Column("uuid", { name: "event_id" })
  eventId: string;

  @Column("timestamp with time zone", {
    name: "created_time_utc",
    default: () => "timezone('utc', now())",
  })
  createdTimeUtc: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "last_updated_time_utc", default: () => "timezone('utc', now())", })
  lastUpdatedTimeUtc: Date;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;

  @ManyToOne(() => Event, (event) => event.bookmarkedEvents)
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;

  @ManyToOne(() => DsUser, (dsUser) => dsUser.bookmarkedEvents)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: DsUser;
}

import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Event } from "./Event";

@Index("reminder_times_pkey", ["eventId"], { unique: true })
@Entity("reminder_times", { schema: "public" })
export class ReminderTimes {
  @Column("uuid", { primary: true, name: "event_id" })
  eventId: string;

  @Column("integer", { name: "time_to_event", default: () => "24" })
  timeToEvent: number;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;

  @OneToOne(() => Event, (event) => event.reminderTimes)
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;
}

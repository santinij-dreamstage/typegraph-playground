import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Event } from "./Event";
import { Remindee } from "./Remindee";

@Index(
  "fki_reminder_recipient_remindee_id_event_id",
  ["eventId", "remindeeId"],
  {}
)
@Index("reminder_recipient_pkey", ["remindeeId"], { unique: true })
@Entity("reminder_recipient", { schema: "public" })
export class ReminderRecipient {
  @Column("uuid", { primary: true, name: "remindee_id" })
  remindeeId: string;

  @Column("uuid", { name: "event_id" })
  eventId: string;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;

  @ManyToOne(() => Event, (event) => event.reminderRecipients)
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;

  @OneToOne(() => Remindee, (remindee) => remindee.reminderRecipient)
  @JoinColumn([{ name: "remindee_id", referencedColumnName: "id" }])
  remindee: Remindee;
}

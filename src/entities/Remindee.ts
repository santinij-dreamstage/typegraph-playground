import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { DsUser } from "./DsUser";
import { ReminderRecipient } from "./ReminderRecipient";

@Index("fki_remindee_id_ds_user_id", ["dsUserId", "id"], {})
@Index("remindee_pkey", ["id"], { unique: true })
@Index("remindee_phone_number_key", ["phoneNumber"], { unique: true })
@Entity("remindee", { schema: "public" })
export class Remindee {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("text", { name: "phone_number", unique: true })
  phoneNumber: string;

  @Column("integer", { name: "country_code", default: () => "1" })
  countryCode: number;

  @Column("uuid", { name: "ds_user_id", nullable: true })
  dsUserId?: string;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;

  @ManyToOne(() => DsUser, (dsUser) => dsUser.remindees)
  @JoinColumn([{ name: "ds_user_id", referencedColumnName: "id" }])
  dsUser: DsUser;

  @OneToOne(
    () => ReminderRecipient,
    (reminderRecipient) => reminderRecipient.remindee
  )
  reminderRecipient: ReminderRecipient;
}

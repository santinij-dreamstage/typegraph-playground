import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { DsUser } from "./DsUser";
import { Ticket } from "./Ticket";
import { TicketIntent } from "./TicketIntent";

@Index(
  "promotion_promo_code_quanity_per_event_discount_percentage_idx",
  ["discountPercentage", "promoCode", "quantityPerEvent"],
  {}
)
@Index("promotion_pkey", ["id"], { unique: true })
@Index("promotion_promo_code_key", ["promoCode"], { unique: true })
@Entity("promotion", { schema: "public" })
export class Promotion {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("text", { name: "promo_code", unique: true })
  promoCode: string;

  @Column("integer", { name: "discount_percentage" })
  discountPercentage: number;

  @Column("integer", {
    name: "quantity_per_event",
    nullable: true,
    default: () => "0",
  })
  quantityPerEvent?: number;

  @Column("boolean", { name: "is_employee_code", default: () => "false" })
  isEmployeeCode: boolean;

  @Column("timestamp with time zone", {
    name: "created_time_utc",
    default: () => "timezone('utc', now())",
  })
  createdTimeUtc: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "last_updated_time_utc", default: () => "timezone('utc', now())", })
  lastUpdatedTimeUtc: Date;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;

  @ManyToOne(() => DsUser, (dsUser) => dsUser.promotions)
  @JoinColumn([{ name: "owner_id", referencedColumnName: "id" }])
  owner: DsUser;

  @OneToMany(() => Ticket, (ticket) => ticket.promotion)
  tickets: Ticket[];

  @OneToMany(() => TicketIntent, (ticketIntent) => ticketIntent.promotion)
  ticketIntents: TicketIntent[];
}

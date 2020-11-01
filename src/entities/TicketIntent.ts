import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { Ticket } from "./Ticket";
import { DsUser } from "./DsUser";
import { EventTicketInfo } from "./EventTicketInfo";
import { Promotion } from "./Promotion";
import { TicketVoucher } from "./TicketVoucher";

@Index(
  "ticket_intent_ds_user_id_event_ticket_info_id_idx",
  ["dsUserId", "eventTicketInfoId"],
  {}
)
@Index("ticket_intent_pkey", ["id"], { unique: true })
@Index(
  "ticket_intent_payment_service_id_is_deleted_id_idx",
  ["isDeleted", "paymentServiceId"],
  {}
)
@Entity("ticket_intent", { schema: "public" })
export class TicketIntent {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "event_ticket_info_id" })
  eventTicketInfoId: string;

  @Column("integer", { name: "ticket_count", default: () => "1" })
  ticketCount: number;

  @Column("text", { name: "payment_service_id" })
  paymentServiceId: string;

  @Column("text", { name: "payment_service_status" })
  paymentServiceStatus: string;

  @Column("text", { name: "status" })
  status: string;

  @Column("integer", { name: "price_in_cents", nullable: true })
  priceInCents?: number;

  @Column("integer", { name: "discount_percentage", nullable: true })
  discountPercentage?: number;

  @Column("uuid", { name: "ds_user_id" })
  dsUserId: string;

  @Column("timestamp with time zone", {
    name: "created_time_utc",
    default: () => "timezone('utc', now())",
  })
  createdTimeUtc: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "last_updated_time_utc", default: () => "timezone('utc', now())", })
  lastUpdatedTimeUtc: Date;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;

  @OneToMany(() => Ticket, (ticket) => ticket.ticketIntent)
  tickets: Ticket[];

  @ManyToOne(() => DsUser, (dsUser) => dsUser.ticketIntents)
  @JoinColumn([{ name: "ds_user_id", referencedColumnName: "id" }])
  dsUser: DsUser;

  @ManyToOne(
    () => EventTicketInfo,
    (eventTicketInfo) => eventTicketInfo.ticketIntents
  )
  @JoinColumn([{ name: "event_ticket_info_id", referencedColumnName: "id" }])
  eventTicketInfo: EventTicketInfo;

  @ManyToOne(() => Promotion, (promotion) => promotion.ticketIntents)
  @JoinColumn([{ name: "promotion_id", referencedColumnName: "id" }])
  promotion: Promotion;

  @OneToMany(() => TicketVoucher, (ticketVoucher) => ticketVoucher.ticketIntent)
  ticketVouchers: TicketVoucher[];
}

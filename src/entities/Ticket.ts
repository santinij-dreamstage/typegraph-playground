import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { DsUser } from "./DsUser";
import { Promotion } from "./Promotion";
import { EventTicketInfo } from "./EventTicketInfo";
import { TicketIntent } from "./TicketIntent";
import { TicketVoucher } from "./TicketVoucher";

@Index(
  "ticket_ticket_holder_id_event_ticket_id_idx",
  ["holderId", "ticketId"],
  {}
)
@Index("ticket_pkey", ["id"], { unique: true })
@Index("ticket_promotion_id_idx", ["promotionId"], {})
@Index(
  "ticket_reservation_time_utc_purchase_time_utc_idx",
  ["purchaseTimeUtc", "reservationExpiresTimeUtc"],
  {}
)
@Index("ticket_ticket_id_idx", ["ticketId"], {})
@Entity("ticket", { schema: "public" })
export class Ticket {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "holder_id" })
  holderId: string;

  @Column("uuid", { name: "ticket_id" })
  ticketId: string;

  @Column("uuid", { name: "promotion_id", nullable: true })
  promotionId?: string;

  @Column("text", { name: "stripe_transaction_id" })
  stripeTransactionId: string;

  @Column("timestamp with time zone", {
    name: "last_used_time_utc",
    nullable: true,
  })
  lastUsedTimeUtc?: Date;

  @Column("timestamp with time zone", {
    name: "reservation_expires_time_utc",
    default: () => "timezone('utc', (now() + '00:10:00'::interval))",
  })
  reservationExpiresTimeUtc: Date;

  @Column("timestamp with time zone", {
    name: "purchase_time_utc",
    nullable: true,
  })
  purchaseTimeUtc?: Date;

  @Column("uuid", { name: "redemption_code", nullable: true })
  redemptionCode?: string;

  @Column("timestamp with time zone", { name: "redeemed_at", nullable: true })
  redeemedAt?: Date;

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

  @Column("text", { name: "status", nullable: true })
  status?: string;

  @ManyToOne(() => DsUser, (dsUser) => dsUser.tickets)
  @JoinColumn([{ name: "holder_id", referencedColumnName: "id" }])
  holder: DsUser;

  @ManyToOne(() => Promotion, (promotion) => promotion.tickets)
  @JoinColumn([{ name: "promotion_id", referencedColumnName: "id" }])
  promotion: Promotion;

  @ManyToOne(() => DsUser, (dsUser) => dsUser.tickets2)
  @JoinColumn([{ name: "purchaser_id", referencedColumnName: "id" }])
  purchaser: DsUser;

  @ManyToOne(
    () => EventTicketInfo,
    (eventTicketInfo) => eventTicketInfo.tickets
  )
  @JoinColumn([{ name: "ticket_id", referencedColumnName: "id" }])
  ticket: EventTicketInfo;

  @ManyToOne(() => TicketIntent, (ticketIntent) => ticketIntent.tickets)
  @JoinColumn([{ name: "ticket_intent_id", referencedColumnName: "id" }])
  ticketIntent: TicketIntent;

  @OneToMany(() => TicketVoucher, (ticketVoucher) => ticketVoucher.ticket)
  ticketVouchers: TicketVoucher[];
}

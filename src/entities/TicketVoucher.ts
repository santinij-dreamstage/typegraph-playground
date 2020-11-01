import { Column, Entity, Index, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { DsUser } from "./DsUser";
import { Ticket } from "./Ticket";
import { TicketIntent } from "./TicketIntent";

@Index(
  "ticket_voucher_ds_user_id_ticket_intent_id_idx",
  ["dsUserId", "ticketIntentId"],
  {}
)
@Index("ticket_voucher_pkey", ["id"], { unique: true })
@Entity("ticket_voucher", { schema: "public" })
export class TicketVoucher {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("uuid", { name: "ticket_intent_id" })
  ticketIntentId: string;

  @Column("uuid", { name: "ticket_code", default: () => "gen_random_uuid()" })
  ticketCode: string;

  @Column("uuid", { name: "ds_user_id" })
  dsUserId: string;

  @Column("text", { name: "status" })
  status: string;

  @Column("timestamp with time zone", {
    name: "created_time_utc",
    default: () => "timezone('utc', now())",
  })
  createdTimeUtc: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "last_updated_time_utc", default: () => "timezone('utc', now())", })
  lastUpdatedTimeUtc: Date;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;

  @ManyToOne(() => DsUser, (dsUser) => dsUser.ticketVouchers)
  @JoinColumn([{ name: "ds_user_id", referencedColumnName: "id" }])
  dsUser: DsUser;

  @ManyToOne(() => Ticket, (ticket) => ticket.ticketVouchers)
  @JoinColumn([{ name: "ticket_id", referencedColumnName: "id" }])
  ticket: Ticket;

  @ManyToOne(() => TicketIntent, (ticketIntent) => ticketIntent.ticketVouchers)
  @JoinColumn([{ name: "ticket_intent_id", referencedColumnName: "id" }])
  ticketIntent: TicketIntent;
}

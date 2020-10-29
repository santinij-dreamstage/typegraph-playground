import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { Event } from "./Event";
import { DbTicketClass, TicketClass } from "./TicketClass";
import { Ticket } from "./Ticket";
import { TicketIntent } from "./TicketIntent";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { Money } from "../types/Money";

@Index(
  "event_ticket_info_event_id_ticket_class_id_key",
  ["eventId", "ticketClassId"],
  { unique: true }
)
@Index(
  "event_ticket_info_event_id_ticket_class_id_idx",
  ["eventId", "ticketClassId"],
  {}
)
@Index("event_ticket_info_pkey", ["id"], { unique: true })
@Entity("event_ticket_info", { schema: "public" })
@ObjectType("EventTicket")
export class EventTicketInfo {
  @Field(() => ID)
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Field(() => Int, {nullable: true})
  available: number;

  @Field(() => Int)
  ticketsSold: number;

  @Field(() => TicketClass)
  ticketClass: TicketClass;

  @Field(() => Money)
  price: Money;

  @Column("uuid", { name: "event_id", unique: true })
  eventId: string;

  @Column("integer", {
    name: "ticket_class_id",
    unique: true,
    default: () => "1",
  })
  ticketClassId: number;

  @Column("integer", { name: "capacity", nullable: true })
  capacity?: number;

  @Column("integer", { name: "price_in_cents" })
  priceInCents: number;

  @Column("character varying", { name: "currency_code", length: 3 })
  currencyCode: string;

  @Field({ name: "salesStartAt"})
  @Column("timestamp with time zone", { name: "sales_start_time_utc" })
  salesStartTimeUtc: Date;

  @Field({ name: "salesEndAt" })
  @Column("timestamp with time zone", {
    name: "sales_end_time_utc",
    nullable: true,
  })
  salesEndTimeUtc?: Date;

  @Field({ name: "createdAt" })
  @Column("timestamp with time zone", {
    name: "created_time_utc",
    default: () => "timezone('utc', now())",
  })
  createdTimeUtc: Date;

  @Field({name: "updatedAt"})
  @UpdateDateColumn({ type: "timestamptz", name: "last_updated_time_utc" })
  lastUpdatedTimeUtc: Date;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;

  @ManyToOne(() => Event, (event) => event.eventTicketInfos)
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;

  @ManyToOne(() => DbTicketClass, (ticketClass) => ticketClass.eventTicketInfos)
  @JoinColumn([
    { name: "ticket_class_id", referencedColumnName: "ticketClassId" },
  ])
  dbTicketClass: DbTicketClass;

  @OneToMany(() => Ticket, (ticket) => ticket.ticket)
  tickets: Ticket[];

  @OneToMany(() => TicketIntent, (ticketIntent) => ticketIntent.eventTicketInfo)
  ticketIntents: TicketIntent[];
}

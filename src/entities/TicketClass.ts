import { registerEnumType } from "type-graphql";
import { Column, Entity, Index, OneToMany, ValueTransformer } from "typeorm";
import { EventTicketInfo } from "./EventTicketInfo";

@Index("ticket_class_name_key", ["name"], { unique: true })
@Index("ticket_class_pkey", ["ticketClassId"], { unique: true })
@Entity("ticket_class", { schema: "public" })
export class DbTicketClass {
  @Column("integer", { primary: true, name: "ticket_class_id" })
  ticketClassId: number;

  @Column("text", { name: "name", unique: true })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description?: string;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;

  @OneToMany(
    () => EventTicketInfo,
    (eventTicketInfo) => eventTicketInfo.dbTicketClass
  )
  eventTicketInfos: EventTicketInfo[];
}


export enum TicketClass {
  GeneralAdmission = "GeneralAdmission",
  Vip = "Vip",
}


registerEnumType(TicketClass, {
  name: "TicketClass",
})

export class TicketClassTransformer implements ValueTransformer {

  to(value: TicketClass): number {
    switch (value) {
      case TicketClass.GeneralAdmission:
        return 1;
      case TicketClass.Vip:
        return 2;
      default:
        throw new Error(`Unknown value for to TicketClass: ${value}`);
    }
  }

  from(value: number): TicketClass {
    switch (value) {
      case 1:
        return TicketClass.GeneralAdmission;
      case 2:
        return TicketClass.Vip;
      default:
        throw new Error(`Unknown value for from TicketClass: ${value}`);
    }
  }
}
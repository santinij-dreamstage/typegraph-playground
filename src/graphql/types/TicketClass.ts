import { registerEnumType } from "type-graphql";


export enum TicketClass {
  GeneralAdmission = "GeneralAdmission",
  Vip = "Vip",
}


registerEnumType(TicketClass, {
  name: "TicketClass",
})

export class TicketClassTransformer {

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
import { TicketClass } from "./TicketClass";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { Money } from "./Money";
import { event_ticket_info as DbEventTicketInfo} from "@prisma/client";


@ObjectType()
export class EventTicket {

  constructor(eti: DbEventTicketInfo) {
    this.dbEventTicketInfo = eti;    
  }

  @Field(() => ID)
  id: string;

  @Field(() => Int, {nullable: true})
  available?: number;

  @Field(() => Int)
  ticketsSold: number;

  @Field(() => Money)
  price: Money;

  @Field(() => TicketClass)
  ticketClass: TicketClass;

  @Field()
  salesStartAt: Date;

  @Field({ nullable: true })
  salesEndAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  dbEventTicketInfo: DbEventTicketInfo;
}

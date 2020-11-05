import { TicketClass } from "./TicketClass";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { Money } from "./Money";


@ObjectType()
export class EventTicket {
  @Field(() => ID)
  id: string;

  @Field(() => Int, {nullable: true})
  available: number;

  @Field(() => Int)
  ticketsSold: number;


  @Field(() => Money)
  price(currencyCode: string, priceInCents: number): Money {
    return new Money(currencyCode, priceInCents);
  }

  @Field(() => TicketClass)
  ticketClass: TicketClass;

  @Field()
  salesStartAt: Date;

  @Field({ nullable: true })
  salesEndAt?: Date;

  @Field({ name: "createdAt" })
  createdTimeUtc: Date;

  @Field({name: "updatedAt"})
  lastUpdatedTimeUtc: Date;
}

import { EventTicket } from "../types/EventTicket";
import { TicketClass, TicketClassTransformer } from "../types/TicketClass";
import { Resolver, Int, FieldResolver, Root, Ctx, ID, UseMiddleware, UnauthorizedError } from "type-graphql";
import { Money } from "../types/Money";
import { GqlContext } from "../GqlContext";
import { IsLoggedIn } from "../../middleware/authChecker";
import {event_ticket_info as DbEventTicketInfo} from "@prisma/client";

@Resolver(() => EventTicket)
export class EventTicketResolver {//implements ResolverInterface<EventTicket> {
  ticketClassTransformer: TicketClassTransformer;

  constructor() {
    this.ticketClassTransformer = new TicketClassTransformer();
  }

  @FieldResolver(() => ID)
  async id(@Root() eti: DbEventTicketInfo): Promise<string> {
    return await eti.id;
  }
  
  @FieldResolver(() => Int, { nullable: true })
  async available(@Root() _eti: DbEventTicketInfo): Promise<number | undefined> {
    //TODO: this needs to do something
    return undefined;
  }

  @FieldResolver(() => Int)
  @UseMiddleware(IsLoggedIn)
  async ticketsSold(@Root() eti: DbEventTicketInfo, @Ctx() { user, prisma, authorizer }: GqlContext): Promise<number> {
    //this will need to be shown to the event owner at some point
    if (user && authorizer.isWriteAuthorized(user)) {
      const results = await prisma.$queryRaw`select COALESCE(count(t.id),0) as cnt
                from event_ticket_info eti
                left join ticket t on t.ticket_id = eti.id
                where t.purchase_time_utc IS NOT NULL 
                and eti.id = '${eti.id}'
                and NOT (eti.is_deleted or t.is_deleted or eti.is_deleted)`
                ;
    return results[0].cnt;
    } else {
      throw new UnauthorizedError();
    }
  }

  @FieldResolver(() => Money)
  async price(@Root() eti: DbEventTicketInfo): Promise<Money> {
    return new Money(eti.currency_code, eti.price_in_cents);
  }

  @FieldResolver(() => TicketClass)
  async ticketClass(@Root() eti: DbEventTicketInfo): Promise<TicketClass> {
    return this.ticketClassTransformer.from(eti.ticket_class_id);
  }

  @FieldResolver(() => Date)
  async salesStartAt(@Root() eti: DbEventTicketInfo): Promise<Date> {
    return eti.sales_start_time_utc;
  }
  
  @FieldResolver(() => Date, {nullable: true})
  async salesEndAt(@Root() eti: DbEventTicketInfo): Promise<Date| undefined> {
    return eti.sales_end_time_utc || undefined;
  }

  @FieldResolver(() => Date)
  async createdAt(@Root() eti: DbEventTicketInfo): Promise<Date> {
    return eti.created_time_utc;
  }

  @FieldResolver(() => Date)
  async updatedAt(@Root() eti: DbEventTicketInfo): Promise<Date> {
    return eti.last_updated_time_utc;
  }
}

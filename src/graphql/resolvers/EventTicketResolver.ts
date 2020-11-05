import { EventTicket } from "../types/EventTicketInfo";
import { TicketClass, TicketClassTransformer } from "../types/TicketClass";
import { Resolver, Int, FieldResolver, Root } from "type-graphql";
import { Money } from "../types/Money";


@Resolver(() => EventTicket)
export class EventTicketResolver {


  @FieldResolver(() => Int, { nullable: true })
  async available(@Root() _eti: EventTicket): Promise<number | undefined> {
    //TODO: this needs to do something
    return undefined;
  }

  // @FieldResolver(() => Int)
  // async ticketsSold(@Root() eti: EventTicketInfo): Promise<number> {
  //   //TODO: Unauthorized unless admin! Also doesn't work 
  //   return await this.eventTicketInfoRepo.createQueryBuilder("eti")
  //     .select("coalesce(count(t.id),0)", "soldCnt")
  //     .leftJoin("ticket", "t", "t.ticket_id = eti.id")
  //     .where("t.purchase_time_utc IS NOT NULL")
  //     .andWhere("NOT eti.is_deleted")
  //     .andWhere("NOT t.is_deleted")
  //     .andWhere("eti.id = :id", { id: eti.id })
  //     .groupBy("eti.id")
  //     .getRawOne();
  // }
}

import { EventPerformer } from "../types/EventPerformer";
import { Performer } from "../types/Performer";
import { Resolver, FieldResolver, Root, Ctx } from "type-graphql";
import { event_performer as DbEventPerformer, performer as DbPerformer } from "@prisma/client";
import { GqlContext } from "../GqlContext";

@Resolver(() => EventPerformer)
export class EventPerformerResolver { // implements ResolverInterface<EventPerformer> {

  //the DbPerformer to Performer resolution happens here because the prisma type has the same fields as our Performer
  //rather than rely on names, we could implement @FieldResolver for each manually
  @FieldResolver(() => Performer)
  async performer(@Root() eventPerformer: DbEventPerformer, @Ctx() { prisma }: GqlContext): Promise<DbPerformer> {
    const performer = await prisma.performer.findOne({
      where: { id: eventPerformer.performer_id }
    });
    if (!performer) {
      throw new Error(`No performer found for ${eventPerformer.id}`)
    }
    else {
      return performer
    }
  }
}

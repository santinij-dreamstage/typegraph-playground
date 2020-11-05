import { EventPerformer } from "../types/EventPerformer";
import { Performer } from "../types/Performer";
import { Resolver, FieldResolver, Root, ResolverInterface } from "type-graphql";

@Resolver(() => EventPerformer)
export class EventPerformerResolver { // implements ResolverInterface<EventPerformer> {

  // @FieldResolver(() => Performer)
  // async performer(@Root() eventPerformer: EventPerformer): Promise<Performer> {
  //   return this.performerRepository.findOneOrFail(eventPerformer.performerId);
  // }
}

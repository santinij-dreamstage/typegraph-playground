import { Event } from "../../entity/Event";
import { Resolver, Query } from "type-graphql";

@Resolver()
export class AllEventsResolver {
  @Query(() => [Event]!)
  async allEvents() {
    return [];
  }
}
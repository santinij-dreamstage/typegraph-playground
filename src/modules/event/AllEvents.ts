import { Event } from "../../entity/Event";
import { Resolver, Query } from "type-graphql";
import { getRepository } from "typeorm";

@Resolver()
export class AllEventsResolver {

  @Query(() => [Event]!)
  async allEvents() {
    const eventRepository = getRepository(Event);
    return eventRepository.find();
  }
}
import { Event } from "../../entity/Event";
import { CreateEventInput, SearchEvent } from "./CreateEventInput";
import { Resolver, Mutation, Query, Ctx, Arg, ID,  ObjectType, Field } from "type-graphql";
import { Repository } from "typeorm";
import { Context } from "src/Context";
import { InjectRepository } from "typeorm-typedi-extensions";

@ObjectType()
class Events {
  constructor(events: Event[]
  ) {
    this.matching = events;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  @Field(() => [Event!]!)
  matching: Event[]
}

@Resolver(() => Event)
export class EventResolver {  //implements ResolverInterface<Event>
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
  ) { }

  @Query(() => Events)
  async events(@Arg("search", { nullable: true }) eventSearch: SearchEvent): Promise<Events> {
    console.warn(`args: ${JSON.stringify(eventSearch)}`);
    const filters = [];
    if (eventSearch) {
      if (eventSearch.id) {
        filters.push({ id: eventSearch.id });
      } if (eventSearch.name) {
        filters.push({ name: eventSearch.name });
      } if (eventSearch.name) {
        filters.push({ slug: eventSearch.slug });
      } if (eventSearch.genre) {
        filters.push({ genre: eventSearch.genre });
      } if (eventSearch.featured) {
        filters.push({ featured: eventSearch.featured });
      }
    }
    return new Events(await this.eventRepository.find(
      {
        where: filters
      }
    ));
  }

  @Query(() => Event)
  async event(@Arg("id", () => ID) eventId: string): Promise<Event | undefined> {
    return this.eventRepository.findOne(eventId);
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unused-vars
  @Mutation(CreateEventInput => Event!)
  addEvent(@Arg("event") _newEvent: CreateEventInput, @Ctx() _ctx: Context): Promise<Event> {
    return new Promise(() => new Event());
  }

}

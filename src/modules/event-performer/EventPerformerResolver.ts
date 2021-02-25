import { EventPerformer } from "../../entities/EventPerformer";
import { Performer } from "../../entities/Performer";
import { Resolver, FieldResolver, Root, ResolverInterface } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";


@Resolver(() => EventPerformer)
export class EventPerformerResolver implements ResolverInterface<EventPerformer> {
  constructor(
    @InjectRepository(Performer) private readonly performerRepository: Repository<Performer>
  ) { }

  @FieldResolver(() => Performer)
  async performer(@Root() eventPerformer: EventPerformer): Promise<Performer> {
    return this.performerRepository.findOneOrFail(eventPerformer.performerId);
  }
}

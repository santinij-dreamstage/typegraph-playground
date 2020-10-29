import { Event } from "../../entities/Event";
import { ObjectType, Field } from "type-graphql";
import { Pagination } from "../../types/Pagination";


@ObjectType()
export class Events {
  constructor(events: Event[]
  ) {
    this.matching = events;
    this.pagination = new Pagination(1);
  }

  @Field(() => [Event])
  matching: Event[];

  @Field(() => Pagination)
  pagination: Pagination;
}

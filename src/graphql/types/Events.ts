import { ObjectType, Field } from "type-graphql";
import { Pagination } from "./Pagination";
import { event as DbEvent } from "@prisma/client";
import {Event} from "./Event";

@ObjectType()
export class Events {
  constructor(events: DbEvent[]
  ) {
    this.matching = events;
    this.pagination = new Pagination(1);
  }

  @Field(() => [Event])
  matching: DbEvent[];

  @Field(() => Pagination)
  pagination: Pagination;
}

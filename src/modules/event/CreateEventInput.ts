import { Event } from "../../entity/Event";
import { Field, InputType, registerEnumType } from "type-graphql";
import { getRepository } from "typeorm";
import {Genre} from "./Genre"


@InputType({ description: "Create a new event" })
export class CreateEventInput implements Partial<Event> {
  @Field()
  id: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType({ description: "Find events" })
export class SearchEvent implements Partial<Event> {
  @Field({ nullable: true })
  id?: string;
  @Field({ nullable: true })
  name?: string;
  @Field(type => Genre, { nullable: true, })
  genre?: Genre;
  @Field({ nullable: true })
  slug?: string;
  @Field({ nullable: true })
  featured?: boolean;
}

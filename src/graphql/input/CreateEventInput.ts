import { Event } from "../types/Event";
import { Field, InputType } from "type-graphql";


@InputType({ description: "Create a new event" })
export class CreateEventInput implements Partial<Event> {
  @Field()
  id: string;

  @Field({ nullable: true })
  description?: string;
}



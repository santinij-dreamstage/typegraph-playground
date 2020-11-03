import { Field, ID, InputType } from "type-graphql";
import { Genre } from "../entities/Genre";


@InputType({ description: "Find events" })
export class SearchEvent {
  //implements Partial<Event> makes sense for updates and mutations but not search 
  //since we allow null (Genre) here but not for event
  @Field(() => ID, { nullable: true })
  id?: string;
  @Field({ nullable: true })
  name?: string;
  @Field(() => Genre, { nullable: true, })
  genre?: Genre;
  @Field({ nullable: true })
  slug?: string;
  @Field({ nullable: true })
  featured?: boolean;
}

@InputType()
export class SearchPerformer {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  name?: string;
}
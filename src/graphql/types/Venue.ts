import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Venue{
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({name: "isOpen"})
  is_open: boolean;

  @Field({ nullable: true, name: "createdAt" })
  createdTimeUtc: Date;

  @Field({ nullable: true, name: "updatedAt" })
  lastUpdatedTimeUtc: Date;
}

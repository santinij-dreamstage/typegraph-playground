import { GraphQLURL } from "graphql-custom-types";
import { Money } from "./Money";
import { Field, ID, ObjectType } from "type-graphql";
import { Event } from "./Event";

@ObjectType()
export class Merchandise {

  @Field(() => Money)
  price(currencyCode: string, priceInCents: number): Money {
    return new Money(currencyCode, priceInCents);
  }

  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => GraphQLURL)
  thumbnailUrl: string;

  @Field(() => GraphQLURL)
  expandedImageUrl: string;

  @Field()
  containsClothing: boolean;

  createdTimeUtc: Date;

  lastUpdatedTimeUtc: Date;

}

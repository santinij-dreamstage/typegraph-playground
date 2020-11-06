import { GraphQLURL } from "graphql-custom-types";
import { Money } from "./Money";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Merchandise {

  @Field(() => Money)
  price(): Money {
    return new Money(this.currency_code, this.price_in_cents);
  }

  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => GraphQLURL, { name: "thumbnailUrl"})
  thumbnail_url: string;

  @Field(() => GraphQLURL, { name: "thumbnailUrl" })
  expanded_image_url: string;

  @Field({ name: "containsClothing"} )
  contains_clothing: boolean;
  
  price_in_cents: number
  
  currency_code: string

  createdTimeUtc: Date;

  lastUpdatedTimeUtc: Date;

}

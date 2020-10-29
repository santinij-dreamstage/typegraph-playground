import { Int, ObjectType, Field } from "type-graphql";

//setting Field properties for arrays:
//nullable: "items" for [Item]! 
//nullable: "itemsAndList" for the [Item]
//nullable: "list" for [item!]
//we should use relay style pagination rather than this structure

@ObjectType()
export class Pagination {

  constructor(page: number, previous?: number, next?: number) {
    this.previousPage = previous;
    this.page = page;
    this.nextPage = next;
  }

  @Field(() => Int, { nullable: true })
  previousPage?: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int, { nullable: true })
  nextPage?: number;
}

import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Money {
    constructor(currency: string, value: number) {
        this.currency = currency;
        this.valueInCents = value;
    }

    @Field()
    currency: string;

    @Field(() => Int)
    valueInCents: number
}
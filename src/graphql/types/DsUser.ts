import { Field, ID, ObjectType } from "type-graphql";

@ObjectType("User")
export class DsUser {

@Field(() => ID)
id:string;

@Field({ nullable: true })
stripeCustomerId?: string;

@Field({ nullable: true })

@Field({ nullable: true })
chatAuthToken?:string;

@Field({ name: "createdAt" })
createdTimeUtc:Date;

@Field({name: "updatedAt"})
lastUpdatedTimeUtc:Date;

@Field(() => ID)
cognitoId:string;
}

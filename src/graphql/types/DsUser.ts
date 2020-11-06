import { Field, ID, ObjectType } from "type-graphql";
import {ds_user as DbUser} from "@prisma/client";

@ObjectType("User")
export class DsUser {

@Field(() => ID)
id:string;

@Field({ nullable: true, name: "stripeId" })
stripeCustomerId?: string;

@Field({ nullable: true, name: "acceptedTos" })
acceptedTosUtc?: Date;

@Field({ nullable: true })
chatAuthToken?:string;

@Field({ name: "createdAt" })
createdTimeUtc:Date;

@Field({name: "updatedAt"})
lastUpdatedTimeUtc:Date;

@Field(() => ID)
cognitoId:string;

dbUser: DbUser;

}

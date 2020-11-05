import { Field, ID, ObjectType } from "type-graphql";


@ObjectType()
export class Performer {

@Field(() => ID)
id:string;

@Field({name: "name"})
actName:string;

@Field({ nullable: true })
description?:string;

@Field({ name: "createdAt" })
createdTimeUtc:Date;

@Field({ name: "updatedAt" })
lastUpdatedTimeUtc:Date;

}

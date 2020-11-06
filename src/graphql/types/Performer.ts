import { Field, ID, ObjectType } from "type-graphql";


@ObjectType()
export class Performer {

@Field(() => ID)
id:string;

@Field({name: "name"})
act_name: string;

@Field({ nullable: true })
description?:string;

@Field({ name: "createdAt" })
created_time_utc:Date;

@Field({ name: "updatedAt" })
last_updated_time_utc:Date;

}

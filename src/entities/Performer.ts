import { Field, ID, ObjectType } from "type-graphql";
import {BaseEntity, Column,Entity,Index,OneToMany, UpdateDateColumn} from "typeorm";
import {EventPerformer} from './EventPerformer'


@Index("performer_pkey",["id",],{ unique:true })
@Index("performer_id_idx",["id",],{  })
@Entity("performer" ,{schema:"public" } )
@ObjectType()
export class Performer extends BaseEntity {

@Field(() => ID)
@Column("uuid",{ primary:true,name:"id" })
id:string;

@Field({name: "name"})
@Column("text",{ name:"act_name" })
actName:string;

@Field({ nullable: true })
@Column("text",{ name:"description",nullable:true })
description?:string;

@Column("text",{ name:"biography",nullable:true })
biography?:string;

@Column("text",{ name:"website",nullable:true })
website?:string;

@Field({ name: "createdAt" })
@Column("timestamp with time zone",{ name:"created_time_utc",default: () => "timezone('utc', now())", })
createdTimeUtc:Date;

@Field({ name: "updatedAt" })
@UpdateDateColumn({ type: "timestamptz", name: "last_updated_time_utc" })
lastUpdatedTimeUtc:Date;

@Column("boolean",{ name:"is_deleted",default: () => "false", })
isDeleted:boolean;

@OneToMany(()=>EventPerformer,eventPerformer=>eventPerformer.performer)
eventPerformers:EventPerformer[];

}

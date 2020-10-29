import {Column,Entity,Index,OneToMany,OneToOne} from "typeorm";
import {BookmarkedEvent} from './BookmarkedEvent'
import {Device} from './Device'
import {Event} from './Event'
import {Performer} from './Performer'
import {Promotion} from './Promotion'
import {Remindee} from './Remindee'
import {Ticket} from './Ticket'
import {TicketIntent} from './TicketIntent'
import {TicketVoucher} from './TicketVoucher'


@Index("ds_user_pkey",["id",],{ unique:true })
@Entity("ds_user" ,{schema:"public" } )
export  class DsUser {

@Column("uuid",{ primary:true,name:"id" })
id:string;

@Column("text",{ name:"stripe_customer_id",nullable:true })
stripeCustomerId?: string;

@Column("timestamp with time zone",{ name:"accepted_tos_utc",nullable:true })
acceptedTosUtc?:Date;

@Column("text",{ name:"chat_auth_token",nullable:true })
chatAuthToken?:string;

@Column("timestamp with time zone",{ name:"created_time_utc",default: () => "timezone('utc', now())", })
createdTimeUtc:Date;

@Column("timestamp with time zone",{ name:"last_updated_time_utc",default: () => "timezone('utc', now())", })
lastUpdatedTimeUtc:Date;

@Column("boolean",{ name:"is_deleted",default: () => "false", })
isDeleted:boolean;

@Column("uuid",{ name:"cognito_id" })
cognitoId:string;

@OneToMany(()=>BookmarkedEvent,bookmarkedEvent=>bookmarkedEvent.user)


bookmarkedEvents:BookmarkedEvent[];

@OneToMany(()=>Device,device=>device.owner)


devices:Device[];

@OneToMany(()=>Event,event=>event.owner)


events:Event[];

@OneToOne(()=>Performer,performer=>performer)  //TODO: ???? performer. was generated


performer:Performer;

@OneToMany(()=>Promotion,promotion=>promotion.owner)


promotions:Promotion[];

@OneToMany(()=>Remindee,remindee=>remindee.dsUser)


remindees:Remindee[];

@OneToMany(()=>Ticket,ticket=>ticket.holder)


tickets:Ticket[];

@OneToMany(()=>Ticket,ticket=>ticket.purchaser)


tickets2:Ticket[];

@OneToMany(()=>TicketIntent,ticketIntent=>ticketIntent.dsUser)


ticketIntents:TicketIntent[];

@OneToMany(()=>TicketVoucher,ticketVoucher=>ticketVoucher.dsUser)


ticketVouchers:TicketVoucher[];

}

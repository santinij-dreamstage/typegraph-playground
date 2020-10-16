import { Field, ID, ObjectType, Int } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Event extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column()
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  shortDescription?: string;

  @Field({ nullable: true })
  @Column()
  hashtag?: string;

  @Field({ nullable: true })
  @Column()
  slug?: string;

  @Field({ nullable: true })
  @Column()
  accentColor?: string;

  @Field({ nullable: true })
  @Column()
  backgroundColor?: string;

  @Field({ nullable: true })
  @Column({ name: "scheduled_start_time_utc" })
  scheduledStartTime: Date;

  @Field({ nullable: true })
  @Column({ name: "scheduled_end_time_utc" })
  scheduledEndTime: Date;

  @Field({ nullable: true })
  @Column({ name: "start_time_utc" })
  startedAt?: Date;

  @Field({ nullable: true })
  @Column({ name: "end_time_utc" })
  endedAt?: Date;

  @Field({ nullable: true })
  @Column()
  socialDescription?: string

  @Field({nullable: true})
  @Column()
  showEndMessage?: string

  @Field({nullable: true})
  @Column()
  ageRestriction?: number;

  @Field()
  @Column({ name: "created_time_utc" })
  createdAt: Date;


  /**
   *
   
    
    
    
    @Field({nullable: true})
    @Column()
    owner: User @juniper(ownership: "owned") # only returned if you are the owner
    @Field({nullable: true})
    @Column()
    venue: Venue! @juniper(ownership: "owned")

    @Field({nullable: true})
    @Column()
    genre: Genre! @juniper(ownership: "owned")
    @Field({ nullable: true })
  @Column()
  genreDescription: string;

    @Field(type => [String], {nullable: true})
  @Column()
  tags: string[];

  @Field()
  @Column()
  featured: boolean

    
    @Field({nullable: true})
    @Column()
    performers(search: SearchPerformer): [EventPerformer!]! @juniper(ownership: "owned")
    @Field({nullable: true})
    @Column()
    eventTickets: [EventTicket!]! @juniper(ownership: "owned")
    @Field({nullable: true})
    @Column()
    status: EventStatus! @juniper(ownership: "owned")

    
    @Field({nullable: true})
    @Column()
    promoVideos: [VideoStream!] @juniper(ownership: "owned")

    @Field({nullable: true})
    @Column()
    heroImageUrl: Url @juniper(ownership: "owned")
    @Field({nullable: true})
    @Column()
    posterImageUrl: Url @juniper(ownership: "owned")
    @Field({nullable: true})
    @Column()
    featuredPosterUrls: [Url!] @juniper(ownership: "owned")
    @Field({nullable: true})
    @Column()
    merchandiseStoreUrl: Url @juniper(ownership: "owned")
    @Field({nullable: true})
    @Column()
    socialImageUrl: Url @juniper(ownership: "owned")
    @Field({nullable: true})
    @Column()
    ticketArtworkUrl: Url @juniper(ownership: "owned")
    @Field({nullable: true})
    @Column()
    enableWatermark: Boolean!
    @Field({nullable: true})
    @Column()
    merchandise: [Merchandise!]! @juniper(ownership: "owned")
    @Field({nullable: true})
    @Column()
    createdAt: DateTimeUtc!
    @Field({nullable: true})
    @Column()
    updatedAt: DateTimeUtc!
   */
}
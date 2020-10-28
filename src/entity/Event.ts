import { Genre, GenreTransformer } from "../modules/event/Genre";
import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

  @Field(type => Genre)
  @Column("integer", {transformer: new GenreTransformer()})
  genre: Genre;

  @Field()
  @Column({ name: "is_featured" })
  featured: boolean;

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
  @CreateDateColumn({ type: "timestamptz", name: "created_time_utc" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamptz", name: "last_updated_time_utc" })
  updatedAt: Date;
}


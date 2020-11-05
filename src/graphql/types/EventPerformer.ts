import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class EventPerformer {

  @Field(() => ID)
  id: string;

  @Field()
  isSoundCheckComplete: boolean;

  @Field()
  isInviteAccepted: boolean;

  @Field()
  isInviteSent: boolean;
  
  @Field({ name: "createdAt" })
  createdTimeUtc: Date;

  @Field({ name: "updatedAt" })
  lastUpdatedTimeUtc: Date;
}

import { Field, ID, ObjectType } from "type-graphql";
import { Performer } from "./Performer";

@ObjectType()
export class EventPerformer {

  @Field(() => ID)
  id: string;

  @Field()
  isSoundCheckComplete: boolean;

  @Field()
  performer: Performer;

  @Field()
  isInviteAccepted: boolean;

  @Field()
  isInviteSent: boolean;
  
  @Field({ name: "createdAt" })
  createdTimeUtc: Date;

  @Field({ name: "updatedAt" })
  lastUpdatedTimeUtc: Date;
}

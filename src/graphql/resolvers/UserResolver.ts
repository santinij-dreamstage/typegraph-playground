import { FieldResolver, ID, Resolver, Root } from "type-graphql";
import { ds_user as DbUser } from "@prisma/client";
import { DsUser } from "../types/DsUser";

//rather than implement these fields, we could rename the DsUser properties so they align with the prisma ds_user
@Resolver(() => DsUser)
export class DsUserResolver {

    @FieldResolver(() => ID)
    async id(@Root() user: DbUser): Promise<string> {
        return user.id;
    }
    
    async cognitoId(@Root() user: DbUser): Promise<string> {
        return user.cognito_id;
    }

    @FieldResolver({ nullable: true})
    async stripeId(@Root() user: DbUser): Promise<string | null> {
        return user.stripe_customer_id;
    }

    @FieldResolver(() => Date, { nullable: true})
    async acceptedTos(@Root() user: DbUser): Promise<Date | null> {
        return user.accepted_tos_utc;
    }

    @FieldResolver({ nullable: true })
    async chatAuthToken(@Root() user: DbUser): Promise<string | null> {
        return user.chat_auth_token;
    }

    @FieldResolver(() => Date, { nullable: true })
    async createdAt(@Root() user: DbUser): Promise<Date> {
        return user.created_time_utc;
    }

    @FieldResolver(() => Date)
    async updatedAt(@Root() user: DbUser): Promise<Date> {
        return user.last_updated_time_utc;
    }

}

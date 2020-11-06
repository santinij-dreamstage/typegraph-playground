import { FieldResolver, ID, Root, Resolver } from "type-graphql";
import { Venue } from "../types/Venue";
import { venue as DbVenue } from "@prisma/client";

@Resolver(() => Venue)
export class VenueResolver {

    @FieldResolver(() => ID)
    async id(@Root() venue: DbVenue): Promise<string> {
        return venue.id;
    }

    async cognitoId(@Root() venue: DbVenue): Promise<string> {
        return venue.name;
    }

    @FieldResolver()
    async isOpen(@Root() venue: DbVenue): Promise<boolean> {
        return venue.is_open;
    }

    @FieldResolver(() => Date, { nullable: true })
    async createdAt(@Root() venue: DbVenue): Promise<Date> {
        return venue.created_time_utc;
    }

    @FieldResolver(() => Date)
    async updatedAt(@Root() venue: DbVenue): Promise<Date> {
        return venue.last_updated_time_utc;
    }
}

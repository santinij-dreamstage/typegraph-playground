import { GqlContext } from "../graphql/GqlContext";
import { MiddlewareFn } from "type-graphql";
import { AuthenticationError } from "apollo-server-express";

//used via @UseMiddleware(IsLoggedIn) on resolver (root or field)
export const IsLoggedIn: MiddlewareFn<GqlContext> = async ({ context }, next) => {
  if (!context.user) {
    throw new AuthenticationError("Must be logged in");
  }
  return next();
};

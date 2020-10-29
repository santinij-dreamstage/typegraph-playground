import { GqlContext } from "../types/GqlContext";
import { MiddlewareFn } from "type-graphql";

//used via @UseMiddleware(IsAuth) on resolver (root or field)
export const IsAuth: MiddlewareFn<GqlContext> = async ({ context }, next) => {
  const auth = context.req.headers.authorization;
  if (!auth) {
    throw new Error("Unauthorized");
  }
  return next();
};


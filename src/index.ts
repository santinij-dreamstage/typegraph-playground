import "reflect-metadata";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import Express from "express";
import cors from "cors";
import { getCorsOrigins, getEnvironment } from "./util";
import { createSchema } from "./graphql/createSchema";
import CognitoExpress from "cognito-express";
import { GqlContext } from "./graphql/GqlContext";
import { PrismaClient } from "@prisma/client";


const gqlRoute = "/api/graphql";
const healthRoute = "/api/health";
const app = Express();

//TODO make env variables and figure out cognito-express/auth 
const AWS_REGION = "us-east-1"
const USER_POOL_ID = "us-east-1_LMhgpqpZz"
//REVIEW:
//dataloader: https://github.com/MichalLytek/type-graphql/issues/51 & https://github.com/slaypni/type-graphql-dataloader
//pagination: https://github.com/MichalLytek/type-graphql/issues/142

const main = async () => {
  const environment = getEnvironment(process.env.NODE_ENV);
  const cognitoExpress = new CognitoExpress({
    region: AWS_REGION,
    cognitoUserPoolId: USER_POOL_ID,
    tokenUse: "id", //Possible Values: access | id
    tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
  });

  function getUser(authHeaderValue: string): Promise<any> {
    const auth = authHeaderValue.split(' ')[1];
    return new Promise((resolve, reject) => {
      return cognitoExpress.validate(auth, (err: any, response: any) => {
        if (err) {
          console.warn(`Encountered error validating token: ${err}`);
          reject(new AuthenticationError(err));
        }
        else {
          console.debug(`token: ${JSON.stringify(response)}`);
          resolve(response);
        }
      });
    });
  }

  const schema = await createSchema();

  app.use(cors({
    credentials: true,
    origin: getCorsOrigins(environment),
    allowedHeaders: [
      "Accept",
      "Accept-Encoding",
      "Accept-Language",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Credentials",
      "Connection",
      "Content-Length",
      "Content-Type",
      "Host",
      "Origin",
      "Referer",
      "Upgrade",
      "User-Agent",
      "X-Amzn-Trace-Id",
    ],
    exposedHeaders: ["Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Credentials",]
  }))

  // const cognito = Authenticator.initializeFor(USER_POOL_ID, environment);

  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn'],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req }) => {

      const context: GqlContext = {
        req,
        prisma: prisma,
      };
  
      if (req.headers.authorization) {
        try {
          const user = await getUser(req.headers.authorization)
          console.debug("Valid Token: ", user);
          context.user = user;
        } catch (error) {
          console.error("token error: ", error);
          throw new AuthenticationError(error)
        }
      }
      return context;
    },
    tracing: true,
  });
  app.get(healthRoute, (req, res) => res.send({ "status": "success" }));
  apolloServer.applyMiddleware({ app, path: gqlRoute });

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
  })
}

main();

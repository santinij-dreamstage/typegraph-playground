import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { Container } from "typedi";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection, useContainer, getConnectionOptions } from "typeorm";
import { EventResolver } from "./modules/event/EventResolver";
import { EventTicketResolver } from "./modules/event-ticket/EventTicketResolver";
import { EventPerformerResolver } from "./modules/event-performer/EventPerformerResolver";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import cors from "cors";
import { getCorsOrigins, getEnvironment } from "./util";

useContainer(Container);

const gqlRoute = "/api/graphql";
const healthRoute = "/api/health";
const app = Express();

//TODO make env variables and figure out cognito-express/auth 
const AWS_REGION = "us-east-1"
const USER_POOL_ID = "us-east-1_TODO_POOL"

const main = async () => {
  const environment = getEnvironment(process.env.NODE_ENV);

  await getConnectionOptions().then(connectionOptions => {
    return createConnection(Object.assign(connectionOptions, {
      namingStrategy: new SnakeNamingStrategy()
    }))
  });

  const schema = await buildSchema({
    resolvers: [EventResolver, EventPerformerResolver, EventTicketResolver],
    container: Container
  });


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


  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
      const context = {
        req
      };
      return context;
    },
  });
  app.get(healthRoute, (req, res) => res.send({ "status": "success" }));
  apolloServer.applyMiddleware({ app, path: gqlRoute });

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
  })
}

main();

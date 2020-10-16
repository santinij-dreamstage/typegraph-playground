import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection, getConnectionOptions } from "typeorm";
import { RegisterResolver } from "./modules/user/Register";
import { AllEventsResolver } from "./modules/event/AllEvents";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const main = async () => {
  await getConnectionOptions().then(connectionOptions => {
    return createConnection(Object.assign(connectionOptions, {
      namingStrategy: new SnakeNamingStrategy()
    }))
  });


  const schema = await buildSchema({
    resolvers: [RegisterResolver, AllEventsResolver]
  });
  const apolloServer = new ApolloServer({ schema });

  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
  })
}

main();
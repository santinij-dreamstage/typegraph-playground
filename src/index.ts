import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { Container } from "typedi";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection, useContainer, getConnectionOptions } from "typeorm";
import { RegisterResolver } from "./modules/user/Register";
import { EventResolver } from "./modules/event/Resolver";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

useContainer(Container);

const main = async () => {
  await getConnectionOptions().then(connectionOptions => {
    return createConnection(Object.assign(connectionOptions, {
      namingStrategy: new SnakeNamingStrategy()
    }))
  });


  const schema = await buildSchema({
    resolvers: [RegisterResolver, EventResolver],
    container: Container
  });
  const apolloServer = new ApolloServer({ schema });

  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
  })
}

main();
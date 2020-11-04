import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { Container } from "typedi";
import Express from "express";
import { createConnection, useContainer, getConnectionOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import cors from "cors";
import { getCorsOrigins, getEnvironment } from "./util";
import { createSchema } from "./createSchema";

import CognitoExpress from "cognito-express";
import { nextTick } from "process";

// import { Authenticator } from "./middleware/Authenticator";

useContainer(Container);

const gqlRoute = "/api/graphql";
const healthRoute = "/api/health";
const app = Express();

//TODO make env variables and figure out cognito-express/auth 
const AWS_REGION = "us-east-1"
const USER_POOL_ID = "us-east-1_TODO_POOL"
//REVIEW:
//dataloader: https://github.com/MichalLytek/type-graphql/issues/51 & https://github.com/slaypni/type-graphql-dataloader
//pagination: https://github.com/MichalLytek/type-graphql/issues/142

const main = async () => {
  const environment = getEnvironment(process.env.NODE_ENV);
  const cognitoExpress = new CognitoExpress({
    region: "us-east-1",
    cognitoUserPoolId: "us-east-1_LMhgpqpZz",
    tokenUse: "id", //Possible Values: access | id
    tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
  });
  await getConnectionOptions().then(connectionOptions => {
    return createConnection(Object.assign(connectionOptions, {
      namingStrategy: new SnakeNamingStrategy()
    }))
  });

  const schema = await createSchema(Container);

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

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
      const context = {
        req
      };
      return context;
    },
    tracing: true,
  });
  // app.use(function(req, res, next) {
  //   if(req.headers.authorization) {
  //     const auth = req.headers.authorization.split(' ')[1];
  //     cognitoExpress.validate(auth, (err, resposne) => {
  //       console.log(err);
  //       console.log(resposne);
  //       res.locals.cognitoUser = resposne;
        
  //       next();
  //     });
  //   }
  //   next();
  // });
  app.get(healthRoute, (req, res) => res.send({ "status": "success" }));
  apolloServer.applyMiddleware({ app, path: gqlRoute });

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
  })
}

main();

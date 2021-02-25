# API

This is a verison of the [platform](https://github.com/DreamStageLive/platform) graphql code in typescript using [typegraphql](https://typegraphql.com/), [typeORM](https://typeorm.io/#/).

## Starting the database

You need a local copy of the dreamstage schema. You can clone the platform repo and start the local database from there using `lefthook run substrate`.

## To run the server

First install dependencies, then fire it up!

`yarn`

`yarn start`

navigate to http://localhost:4000/api/graphql

## Layout

The entities are decorated with typeORM and typegraphql declarations to define all the columns, relationships and graphql fields (sometimes they can share but occasionally they must be separate). Dedicated field resolvers are implemented when we need more complex logic than converting a database column (either query another table or build a structure). In this case we add `@Resolver(() => type)` to a class and use `@FieldResolver` to add the logic. It helps to include `extends ResovlerInterface<type>` in order to make sure the defined fields and field resolver return types match.

const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use(
   '/graphql',
   graphQlHttp({
      schema: buildSchema(`
      type RootQuery {
         events: [String!]!
      } 

      type RootMutation {
         createEvent(name: String): String
      }

      schema {
         query: RootQuery
         mutation: RootMutation
      }
   `),
      rootValue: { // <---- resolvers
         events: () => {
            return ['Teste1', 'Teste2', 'Teste3'];
         },
         createEvent: (args) => {
            const eventName = args.name;
            return eventName;
         }
      },
      graphiql: true
   }))
app.listen(3000);
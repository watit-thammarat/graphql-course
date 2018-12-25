import { GraphQLServer, PubSub } from 'graphql-yoga';

import db from './db.js';
import resolvers from './resolvers';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db,
    pubsub
  }
});

server.start(() => {
  console.log('The server is up');
});

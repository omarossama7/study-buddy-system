import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { connectProducer } from './config/kafka.js';
import { authenticate } from './middleware/authMiddleware.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await connectProducer();

  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const user = authenticate(req);
      return { user };
    },
  });

  console.log(`🚀 Server ready at ${url}`);
};

startServer();

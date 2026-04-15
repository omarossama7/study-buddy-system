import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { connectProducer } from "./config/kafka.js";
import typeDefs from "./graphql/schema.js";
import resolvers from "./graphql/resolvers.js";
import { getUserFromToken } from "./middleware/authMiddleware.js";

try {
  await connectProducer();
  console.log("Kafka connected");
} catch (err) {
  console.log("Kafka not running, skipping...");
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },

  context: async ({ req }) => {
    const token = req.headers.authorization || "";

    const user = getUserFromToken(token);

    return {
      user, 
    };
  },
});

console.log(`🚀 Server ready at ${url}`);
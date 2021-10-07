require("dotenv").config();
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { typeDefs, resolvers } from "./schema";
import { getUSer, protectResolver } from "./user/user.utils";
import { graphqlUploadExpress } from "graphql-upload";

const PORT = process.env.PORT;
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUSer(req.headers.token),
        protectResolver,
      };
    },
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });
  await server.start();

  const app = express();

  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress());
  app.use("/static", express.static("tempUpload"));
  server.applyMiddleware({ app });

  await new Promise((r) => app.listen({ port: PORT }, r));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();

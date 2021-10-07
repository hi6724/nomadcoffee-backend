import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    createAccount(
      name: String
      username: String!
      password: String!
      location: String
      email: String!
    ): MutationResult!
  }
`;

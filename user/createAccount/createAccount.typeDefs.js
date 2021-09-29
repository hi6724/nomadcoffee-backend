import { gql } from "apollo-server-core";

export default gql`
  type CreateAccountResult {
    ok: Boolean!
    error: String
  }
  type Mutation {
    createAccount(
      name: String
      username: String!
      password: String!
      location: String
      email: String!
    ): CreateAccountResult!
  }
`;

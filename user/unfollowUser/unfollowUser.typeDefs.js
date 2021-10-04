import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    unFollowUser(username: String): MutationResult!
  }
`;

import { gql } from "apollo-server-core";

export default gql`
  type SeeFollowersResult {
    ok: Boolean!
    error: String
    followers: [User]
  }
  type Query {
    seeFollowers(username: String!, lastId: Int): SeeFollowersResult!
  }
`;

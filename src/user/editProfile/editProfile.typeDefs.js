import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    editProfile(
      username: String
      name: String
      location: String
      password: String
      bio: String
      avatarURL: Upload
    ): MutationResult!
  }
`;

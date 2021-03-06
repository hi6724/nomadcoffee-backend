import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    editCoffeeShop(
      id: Int
      name: String
      photos: [Upload]
      categories: [String]
    ): MutationResult!
  }
`;

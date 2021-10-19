import { gql } from "apollo-server-core";

export default gql`
  type Query {
    seeCoffeeShop(id: Int!): CoffeeShop
  }
  type SeeCoffeeShopsResult {
    CoffeeShops: [CoffeeShop]
    totalPages: Int
  }
  type Query {
    seeCoffeeShops(page: Int): SeeCoffeeShopsResult
  }
`;

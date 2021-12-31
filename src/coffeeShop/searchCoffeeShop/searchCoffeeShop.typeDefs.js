import { gql } from "apollo-server-core";

export default gql`
  type searchResult {
    coffeeShops: [CoffeeShop]
    categories: [Category]
  }
  type Query {
    searchCoffeeShop(keyword: String!): searchResult
  }
`;

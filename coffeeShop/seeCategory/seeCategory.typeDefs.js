import { gql } from "apollo-server-core";

export default gql`
  type Query {
    seeCategory(name: String!): Category
  }
  type Query {
    seeCategories(page: Int): [Category]
  }
`;

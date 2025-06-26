import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Organization {
    id: ID!
    name: String!
  }

  type Query {
    organizations: [Organization]
  }

  type Mutation {
    createOrganization(name: String!): Organization!
  }
`;

const { gql } = require('apollo-server');

const typeDefs = gql`
  type AvailabilitySlot {
    id: ID!
    userId: String!
    date: String!
    startTime: String!
    endTime: String!
  }

  type Query {
    getAvailability: [AvailabilitySlot]
    getSlotById(id: ID!): AvailabilitySlot
  }

  type Mutation {
    createSlot(
      date: String!
      startTime: String!
      endTime: String!
    ): AvailabilitySlot

    updateSlot(
      id: ID!
      date: String
      startTime: String
      endTime: String
    ): AvailabilitySlot

    deleteSlot(id: ID!): AvailabilitySlot
  }
`;

module.exports = typeDefs;
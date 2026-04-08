import { gql } from "apollo-server";

export const typeDefs = gql`
  type StudySession {
    id: ID!
    title: String!
    description: String
    startTime: String!
    endTime: String
    userId: String!
    subject: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getStudySessions: [StudySession!]!
    getStudySession(id: ID!): StudySession
  }

  type Mutation {
    createStudySession(
      title: String!
      description: String
      startTime: String!
      endTime: String
      userId: String!
      subject: String!
    ): StudySession!

    updateStudySession(
      id: ID!
      title: String
      description: String
      startTime: String
      endTime: String
      subject: String
    ): StudySession

    deleteStudySession(id: ID!): Boolean!
  }
`;
import { createStudySession, getStudySessions, getStudySessionById, updateStudySession, deleteStudySession } from "../services/studySessionService.js";

export const resolvers = {
  Query: {
    getStudySessions: async () => {
      return await getStudySessions();
    },

    getStudySession: async (_, { id }) => {
      return await getStudySessionById(id);
    },
  },

  Mutation: {
    createStudySession: async (_, args) => {
      return await createStudySession(args);
    },

    updateStudySession: async (_, { id, ...updates }) => {
      return await updateStudySession(id, updates);
    },

    deleteStudySession: async (_, { id }) => {
      return await deleteStudySession(id);
    },
  },
};
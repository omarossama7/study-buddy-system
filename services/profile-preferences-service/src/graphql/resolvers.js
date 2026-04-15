import { updatePreferences } from '../services/profileService.js';
import prisma from '../config/db.js';

export const resolvers = {
  Query: {
    getProfile: async (_, __, { user }) => {
      return prisma.profile.findUnique({
        where: { userId: user.id },
      });
    },
  },

  Mutation: {
    updateProfile: async (_, args, { user }) => {
      return updatePreferences(user.id, args);
    },
  },
};

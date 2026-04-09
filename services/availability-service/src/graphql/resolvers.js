const {
  getAllSlots,
  getOneSlot,
  createSlot,
  updateSlot,
  deleteSlot,
} = require('../services/availability.service');

const resolvers = {
  Query: {
    getAvailability: async (_, { userId }) => {
      try {
        const slots = await getAllSlots(userId);

        return slots.map((slot) => ({
          ...slot,
          date: new Date(slot.date).toISOString(), // Convert to ISO string
          startTime: new Date(slot.startTime).toLocaleString("en-US"), // Format start time
          endTime: new Date(slot.endTime).toLocaleString("en-US"), // Format end time
        }));
      } catch (err) {
        throw new Error(err.message);
      }
    },

    getSlotById: async (_, { id }) => {
      try {
        const slot = await getOneSlot(id);

        if (!slot) {
          throw new Error('Slot not found');
        }

        return slot;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },

  Mutation: {
    createSlot: async (_, { userId, date, startTime, endTime }) => {
      try {
        return await createSlot(userId, date, startTime, endTime);
      } catch (err) {
        throw new Error(err.message);
      }
    },

    updateSlot: async (_, { id, ...updates }) => {
      try {
        return await updateSlot(id, updates);
      } catch (err) {
        throw new Error(err.message);
      }
    },

    deleteSlot: async (_, { id }) => {
      try {
        return await deleteSlot(id);
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
};

module.exports = resolvers;
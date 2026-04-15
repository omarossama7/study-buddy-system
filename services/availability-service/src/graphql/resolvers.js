const {
  getAllSlots,
  getOneSlot,
  createSlot,
  updateSlot,
  deleteSlot,
} = require('../services/availability.service');

const formatSlot = (slot) => ({
  ...slot,
  date: new Date(slot.date).toISOString(),
  startTime: new Date(slot.startTime).toISOString(),
  endTime: new Date(slot.endTime).toISOString(),
});

const resolvers = {
  Query: {
    getAvailability: async (_, __, context) => {
      try {
        if (!context.user) {
          throw new Error("Unauthorized");
        }

        const slots = await getAllSlots(context.user.id);

        return slots.map(formatSlot);
      } catch (err) {
        throw new Error(err.message);
      }
    },

    getSlotById: async (_, { id }, context) => {
      try {
        if (!context.user) {
          throw new Error("Unauthorized");
        }

        const slot = await getOneSlot(id);

        if (!slot) {
          throw new Error("Slot not found");
        }

      
        if (slot.userId !== context.user.id) {
          throw new Error("Forbidden");
        }

        return formatSlot(slot);
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
};

module.exports = resolvers;
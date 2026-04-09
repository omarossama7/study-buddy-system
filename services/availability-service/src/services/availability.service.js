const prisma = require('../config/db');
const { sendEvent } = require('../config/kafka');
const { v4: uuidv4 } = require('uuid');

//get all slots for a user
const getAllSlots = async (userId) => {
    return await prisma.availabilitySlot.findMany({
        where: { userId },
        orderBy: { date: 'asc' }
    });
}

const getOneSlot = async (id) => {
  
  return await prisma.availabilitySlot.findUnique({
    where: { id }, 
  });
};

const createSlot = async (userId, date, startTime, endTime) => {
  // validate that ur not a time traveller
  const currDate = new Date();
  const slotDate = new Date(date);

  if (slotDate < currDate) {
    throw new Error("Cannot create a slot for a past date.");
  }

  timeRangeValidator(startTime, endTime);
  await isOverlapping(userId, date, startTime, endTime);

  // making sure db write succeeds b4 sending kafka event
  const slot = await prisma.availabilitySlot.create({
        data: { userId, 
          date: slotDate,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
    },
  });

    await sendEvent('availability-events', {
        eventName: 'AvailabilityUpdated',
        timestamp: new Date().toISOString(),
        producer: 'availability-service',
        correlationId: uuidv4(),
        payload: {
          userId,
          slotId: slot.id,
          action: 'CREATED',
    },
  });

  return slot;
};

const deleteSlot = async (id) => {
  const toDelete = await prisma.availabilitySlot.delete({
    where: { id },
  });
  await sendEvent('availability-events', {
  eventName: 'AvailabilityUpdated',
  timestamp: new Date().toISOString(),
  producer: 'availability-service',
  correlationId: uuidv4(),
  payload: {
    userId: deleted.userId,
    slotId: id,
    action: 'DELETED',
  },
});

return deleted;
};

const updateSlot = async (id, updates) => {
  const exists = await getOneSlot(id);

  if (!exists) {
    throw new Error('Slot not found');
  }

  const newStart = updates.startTime || exists.startTime;
  const newEnd = updates.endTime || exists.endTime;
  const newDate = updates.date || exists.date;

  timeRangeValidator(newStart, newEnd);

  // exclude current slot from the check
  const slots = await prisma.availabilitySlot.findMany({
    where: {
      userId: exists.userId,
      date: new Date(newDate),
      NOT: { id },
    },
  });

  for (const slot of slots) {
    const overlap =
      new Date(newStart) < new Date(slot.endTime) &&
      new Date(newEnd) > new Date(slot.startTime);

    if (overlap) {
      throw new Error('Updated slot overlaps with another slot');
    }
  }

  await sendEvent('availability-events', {
  eventName: 'AvailabilityUpdated',
  timestamp: new Date().toISOString(),
  producer: 'availability-service',
  correlationId: uuidv4(),
  payload: {
    userId: existing.userId,
    slotId: id,
    action: 'UPDATED',
  },
});
};



//no overlap
const isOverlapping = async (userId, date, startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const targetDate = new Date(date);

  // Get all slots for that user on same day
  const existingSlots = await prisma.availabilitySlot.findMany({
    where: {
      userId,
      date: targetDate,
    },
  });

  for (const slot of existingSlots) {
    const existingStart = new Date(slot.startTime);
    const existingEnd = new Date(slot.endTime);

    if (start < existingEnd && end > existingStart) {
      throw new Error('Time slot overlaps with an existinsg slot');
    }
  }
};

const timeRangeValidator = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) {
    throw new Error('Start time must be before end time');
  }
};




module.exports = {
  getAllSlots,
  getOneSlot,
  createSlot,
  deleteSlot,
  updateSlot,
};
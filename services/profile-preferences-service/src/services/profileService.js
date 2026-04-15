import prisma from '../config/db.js';
import { publishEvent } from '../config/kafka.js';

export const updatePreferences = async (userId, data) => {
  const profile = await prisma.profile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });

  await publishEvent('UserPreferencesUpdated', {
    userId,
    ...data,
  });

  return profile;
};

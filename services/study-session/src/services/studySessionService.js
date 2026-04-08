import prisma from "../config/db.js";

export const createStudySession = async (data) => {
  return await prisma.studySession.create({
    data: {
      ...data,
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : null,
    },
  });
};

export const getStudySessions = async () => {
  return await prisma.studySession.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getStudySessionById = async (id) => {
  return await prisma.studySession.findUnique({
    where: { id },
  });
};

export const updateStudySession = async (id, updates) => {
  return await prisma.studySession.update({
    where: { id },
    data: {
      ...updates,
      startTime: updates.startTime ? new Date(updates.startTime) : undefined,
      endTime: updates.endTime ? new Date(updates.endTime) : null,
    },
  });
};

export const deleteStudySession = async (id) => {
  await prisma.studySession.delete({
    where: { id },
  });
  return true;
};
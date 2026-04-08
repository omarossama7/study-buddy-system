import prisma from "../config/db.js";

// ─── Kafka event → notification message map ───────────────────────────────────

const buildNotification = (topic, data) => {
  const payload = data.payload || data;

  switch (topic) {
    case "MatchFound":
      return {
        userId: payload.userId,
        type: "MATCH_FOUND",
        message: `You have a new study buddy match! Compatibility score: ${Math.round(payload.score)}/100.`,
        metadata: JSON.stringify({ matchedUserId: payload.matchedUserId, score: payload.score, reasons: payload.reasons }),
      };

    case "StudySessionCreated":
      return {
        userId: payload.userId,
        type: "SESSION_CREATED",
        message: `Your study session "${payload.title || payload.subject}" has been created.`,
        metadata: JSON.stringify({ sessionId: payload.sessionId }),
      };

    case "StudySessionJoined":
      return {
        userId: payload.hostUserId,
        type: "SESSION_INVITATION",
        message: `A student has joined your study session "${payload.title || payload.subject}".`,
        metadata: JSON.stringify({ sessionId: payload.sessionId, joinedUserId: payload.userId }),
      };

    case "BuddyRequestCreated":
      return {
        userId: payload.receiverId,
        type: "BUDDY_REQUEST",
        message: "You have received a new study buddy request!",
        metadata: JSON.stringify({ senderId: payload.senderId }),
      };

    default:
      return null;
  }
};

// ─── Kafka handler ────────────────────────────────────────────────────────────

export const handleKafkaMessage = async (topic, data) => {
  const notif = buildNotification(topic, data);
  if (!notif || !notif.userId) {
    console.log(`Skipping notification for topic ${topic} — no target userId`);
    return;
  }

  await prisma.notification.create({ data: notif });
  console.log(`Notification created for user ${notif.userId} [${notif.type}]`);
};

// ─── GraphQL-facing functions ─────────────────────────────────────────────────

export const getNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getUnreadNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: { userId, isRead: false },
    orderBy: { createdAt: "desc" },
  });
};

export const markAsRead = async (id, userId) => {
  const notif = await prisma.notification.findUnique({ where: { id } });
  if (!notif) throw new Error("Notification not found");
  if (notif.userId !== userId) throw new Error("Not authorized");

  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
};

export const markAllAsRead = async (userId) => {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
  return true;
};

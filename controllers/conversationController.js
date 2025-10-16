const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");

async function getAllConversationsByUserId(req, res, next) {
  if (req.query.userId && req.query.userId !== "") {
    const userId = Number(req.query.userId);
    const conversations = await prisma.conversation.findMany({
      where: {
        userIds: {
          has: userId,
        },
        isActive: true,
      },
      include: {
        messages: {
          // take: 1,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: true,
          },
        },
        ChatMember: {
          where: {
            NOT: {
              userId: userId,
            },
          },
          include: {
            user: true,
          },
        },
      },
    });

    const conversationsData = conversations.filter(
      (conversation) => conversation.messages.length > 0
    );
    return res.json(conversationsData);
  } else {
    next();
  }
}

async function getCurrentConversation(req, res, next) {
  if (req.query.userIds && req.query.userIds !== "") {
    const userIds = JSON.parse("[" + req.query.userIds + "]");
    const conversation = await prisma.conversation.findFirst({
      where: {
        userIds: {
          hasEvery: userIds,
        },
        isActive: true,
      },
      include: {
        messages: {
          include: {
            user: true,
          },
        },
        ChatMember: {
          where: {
            NOT: {
              userId: req.user.id,
            },
          },
          include: {
            user: true,
          },
        },
      },
    });

    return res.json(conversation);
  } else {
    next();
  }
}

async function getAllByUserIdsAndFriendId(req, res, next) {
  if (
    req.query.userIds &&
    req.query.userIds !== "" &&
    req.query.friendId &&
    req.query.friendId !== ""
  ) {
    const userIds = JSON.parse("[" + req.query.userIds + "]");
    const conversations = await prisma.conversation.findFirst({
      where: {
        userIds: {
          hasEvery: userIds,
        },
        isActive: true,
      },
      include: {
        messages: {
          include: {
            user: true,
          },
        },
      },
    });

    const friendUser = await prisma.user.findFirst({
      where: {
        id: Number(req.query.friendId),
        isActive: true,
      },
    });

    conversations.friend = friendUser;

    return res.json(conversations);
  } else {
    next();
  }
}

async function getAllConversations(req, res) {
  const conversations = await prisma.conversation.findMany({
    where: {
      isActive: true,
    },
  });

  return res.json(conversations);
}

async function createConversation(req, res, next) {
  try {
    const userIds = JSON.parse("[" + req.body.userIds + "]");

    const Conversation = await prisma.conversation.create({
      data: {
        userIds: userIds,
      },
    });

    return res.json(Conversation);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllConversationsByUserId,
  getAllConversations,
  getAllByUserIdsAndFriendId,
  getCurrentConversation,
  createConversation,
};

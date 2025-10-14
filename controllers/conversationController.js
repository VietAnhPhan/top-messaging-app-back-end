const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");

async function getUser(req, res) {
  const user = await prisma.user.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });

  return res.json({ user });
}

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
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: true,
          },
        },
      },
    });
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

async function updateUser(req, res, next) {
  try {
    req.params.id = parseInt(req.params.id);

    let user = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (key === "password") {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
      } else if (value === "") {
        continue;
      } else {
        user[key] = value;
      }
    }

    await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: user,
    });

    return res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  const id = Number(req.params.id);

  const user = await prisma.user.update({
    where: {
      id: id,
      AND: {
        isActive: true,
      },
    },
    data: {
      isActive: false,
    },
  });

  return res.json({
    user,
  });
}

module.exports = {
  getUser,
  getAllConversations,
  getAllConversationsByUserId,
  createConversation,
  updateUser,
  deleteUser,
};

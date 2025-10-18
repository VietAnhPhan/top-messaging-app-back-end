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
    });
    return res.json(conversations);
  } else {
    next();
  }
}

async function getAllMessages(req, res) {
  const messages = await prisma.message.findMany({
    where: {
      isActive: true,
    },
  });

  return res.json(messages);
}

async function createMessage(req, res, next) {
  try {
    const userId = Number(req.body.userId);
    const conversationId = Number(req.body.conversationId);
    const message = req.body.message;

    let filePath = "";
    let fileType = "";
    let hasMedia = false;

    if (req.body.filePath && req.body.fileType) {
      filePath = req.body.filePath;
      fileType = req.body.fileType;
      hasMedia = true;
    }

    if (message === "" && filePath === "" && fileType === "") {
      return res.json(null);
    }

    const Message = await prisma.message.create({
      data: {
        message: message,
        userId: userId,
        conversationId: conversationId,
      },
    });

    if (hasMedia) {
      const Media = await prisma.media.create({
        data: {
          messageId: Message.id,
          filePath: filePath,
          type: fileType,
        },
      });
      Message.Media = Media;
    } else {
      Message.Media = [];
    }

    return res.json(Message);
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
  getAllMessages,
  getAllConversationsByUserId,
  createMessage,
  updateUser,
  deleteUser,
};

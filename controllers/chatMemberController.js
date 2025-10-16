const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");

async function getchatMember(req, res) {
  const user = await prisma.chatMember.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });

  return res.json({ user });
}

async function getAllChatMembers(req, res, next) {
  const chatMembers = await prisma.chatMember.findMany({
    where: {
      isActive: true,
    },
  });

  return res.json(chatMembers);
}

async function createChatMember(req, res, next) {
  try {
    const conversationId = Number(req.body.conversationId);

    const userId = Number(req.body.userId);

    const chatMember = await prisma.chatMember.create({
      data: {
        userId: userId,
        conversationId: conversationId,
      },
    });

    return res.json(chatMember);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getchatMember,
  getAllChatMembers,
  createChatMember,
};

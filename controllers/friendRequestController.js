const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function getUser(req, res) {
  const user = await prisma.user.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });

  return res.json({ user });
}

async function getfriendRequest(req, res, next) {
  if (
    req.query.friend_request &&
    req.query.friend_request == "true" &&
    req.query.sender_id &&
    req.query.sender_id !== ""
  ) {
    const userId = Number(req.query.sender_id);

    const friendRequest = await prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        isActive: true,
      },
      include: {
        receiver: true,
      },
    });
    return res.json(friendRequest);
  } else {
    next();
  }
}

async function getAll(req, res) {
  const messages = await prisma.friendRequest.findMany({
    where: {
      isActive: true,
    },
  });

  return res.json(messages);
}

async function create(req, res, next) {
  try {
    const senderId = Number(req.body.senderId);
    const receiverId = Number(req.body.receiverId);

    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: senderId,
        receiverId: receiverId,
      },
    });

    return res.json(friendRequest);
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
  getAll,
  getfriendRequest,
  create,
  updateUser,
  deleteUser,
};

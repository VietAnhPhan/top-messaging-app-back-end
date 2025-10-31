const bcrypt = require("bcryptjs");
const { prisma } = require("../config/helpers");
const jwt = require("jsonwebtoken");

async function getUser(req, res) {
  const user = await prisma.user.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });

  return res.json(user);
}

async function searchUser(req, res, next) {
  if (
    req.query.contact &&
    req.query.contact != "" &&
    req.query.search &&
    req.query.search == "true"
  ) {
    const User = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: { startsWith: req.query.contact, mode: "insensitive" },
          },
          {
            name: {
              contains: req.query.contact.toLowerCase(),
              mode: "insensitive",
            },
          },
        ],
        isActive: true,
      },
    });
    return res.json(User);
  }

  if (req.query.username && req.query.username != "") {
    const User = await prisma.user.findFirst({
      where: {
        username: req.query.username,
        isActive: true,
      },
    });
    return res.json(User);
  }
  next();
}

async function getChatUser(req, res, next) {
  let conversationId = req.query.conversation_id;
  let userId = req.query.auth_id;
  if (!conversationId || conversationId === "" || !userId || userId === "") {
    next();
  } else {
    const conversation = await prisma.conversation.findFirst({
      where: {
        isActive: true,
        id: Number(conversationId),
      },
      include: {
        ChatMember: {
          where: {
            NOT: {
              userId: Number(userId),
            },
          },
          include: {
            user: true,
          },
        },
      },
    });

    return res.json(conversation.ChatMember[0].user);
  }
}

async function getAll(req, res) {
  const users = await prisma.user.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return res.json(users);
}

async function createUser(req, res, next) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      isAdmin: req.body.isAdmin ? true : false,
    };

    const User = await prisma.user.create({
      data: user,
    });

    const userAuth = {
      username: req.body.username,
      password: req.body.password,
    };

    const token = jwt.sign(userAuth, "jwt_secret");
    return res.json({ username: User.username, token });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    req.params.id = parseInt(req.params.id);

    let user = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (key === "password" && value !== "") {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
      } else if (value === "") {
        continue;
      } else if (key === "uploaded_avatar") {
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

async function resetPassword(req, res, next) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    let hashedPassword = "";

    if (password !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const User = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
      },
    });

    return res.json(User);
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
  getAll,
  getUser,
  searchUser,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  getChatUser,
};

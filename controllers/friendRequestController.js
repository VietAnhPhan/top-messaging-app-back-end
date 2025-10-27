const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// async function getUser(req, res) {
//   const user = await prisma.user.findFirst({
//     where: {
//       id: Number(req.params.id),
//     },
//   });

//   return res.json({ user });
// }

async function getfriendRequest(req, res, next) {
  if (req.query.sent && req.query.sent == "true") {
    const friendRequest = await prisma.friendRequest.findMany({
      where: {
        senderId: req.user.id,
        status: "pending",
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

async function getReceivingInvitations(req, res, next) {
  if (req.query.receiving && req.query.receiving == "true") {
    const friendRequest = await prisma.friendRequest.findMany({
      where: {
        receiverId: req.user.id,
        status: "pending",
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

async function getByChatUserId(req, res, next) {
  if (req.query.chatUserId && req.query.chatUserId !== "") {
    const friendRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            receiverId: req.user.id,
            senderId: Number(req.query.chatUserId),
          },
          {
            receiverId: Number(req.query.chatUserId),
            senderId: req.user.id,
          },
        ],
        AND: {
          status: "pending",
        },
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
    const receiverId = Number(req.body.receiverId);
    const priorFriendRequest = await prisma.friendRequest.findFirst({
      where: {
        senderId: req.user.id,
        receiverId: receiverId,
      },
    });

    if (priorFriendRequest) {
      const updatedFriendRequest = await prisma.friendRequest.update({
        where: {
          id: priorFriendRequest.id,
        },
        data: {
          status: "pending",
        },
      });

      return res.json(updatedFriendRequest);
    }

    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: req.user.id,
        receiverId: receiverId,
      },
    });

    return res.json(friendRequest);
  } catch (err) {
    next(err);
  }
}

// async function updateUser(req, res, next) {
//   try {
//     req.params.id = parseInt(req.params.id);

//     let user = {};
//     for (const [key, value] of Object.entries(req.body)) {
//       if (key === "password") {
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);
//         user.password = hashedPassword;
//       } else if (value === "") {
//         continue;
//       } else {
//         user[key] = value;
//       }
//     }

//     await prisma.user.update({
//       where: {
//         id: req.params.id,
//       },
//       data: user,
//     });

//     return res.json({ user });
//   } catch (err) {
//     next(err);
//   }
// }

// async function deleteUser(req, res, next) {
//   const id = Number(req.params.id);

//   const user = await prisma.user.update({
//     where: {
//       id: id,
//       AND: {
//         isActive: true,
//       },
//     },
//     data: {
//       isActive: false,
//     },
//   });

//   return res.json({
//     user,
//   });
// }

async function revokeInvitation(req, res, next) {
  try {
    if (req.query.revoke && req.query.revoke === "true" && req.params.id) {
      const revokeInvitation = await prisma.friendRequest.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          status: "cancel",
        },
      });

      return res.json(revokeInvitation);
    }
    next();
  } catch (err) {
    next(err);
  }
}

async function rejectInvitation(req, res, next) {
  try {
    if (req.query.reject && req.query.reject === "true" && req.params.id) {
      const rejectedInvitation = await prisma.friendRequest.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          status: "rejected",
        },
      });

      return res.json(rejectedInvitation);
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  // getUser,
  getAll,
  getfriendRequest,
  create,
  // updateUser,
  // deleteUser,
  revokeInvitation,
  getReceivingInvitations,
  getByChatUserId,
  rejectInvitation,
};

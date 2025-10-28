const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

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
        sender: true,
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
          OR: [
            { status: "pending" },
            {
              status: "accepted",
            },
          ],
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

async function acceptInvitation(req, res, next) {
  try {
    if (req.query.accept && req.query.accept === "true" && req.params.id) {
      const invitation = await prisma.friendRequest.findFirst({
        where: {
          id: Number(req.params.id),
        },
      });

      const friends = await prisma.friend.findMany({
        where: {
          OR: [
            {
              loginuserId: req.user.id,
              friendId: invitation.senderId,
            },
            {
              loginuserId: invitation.senderId,
              friendId: req.user.id,
            },
          ],
        },
      });

      if (friends.length == 2) {
        await prisma.friend.updateMany({
          where: {
            OR: [
              {
                loginuserId: req.user.id,
                friendId: Number(req.params.id),
              },
              {
                loginuserId: Number(req.params.id),
                friendId: req.user.id,
              },
            ],
          },
          data: {
            status: "friends",
          },
        });
      } else if (friends.length < 2) {
        await prisma.friend.createMany({
          data: [
            {
              loginuserId: req.user.id,
              friendId: invitation.senderId,
              status: "friends",
            },
            {
              loginuserId: invitation.senderId,
              friendId: req.user.id,
              status: "friends",
            },
          ],
        });
      }

      const acceptedInvitation = await prisma.friendRequest.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          status: "accepted",
        },
      });

      return res.json(acceptedInvitation);
    }
    next();
  } catch (err) {
    next(err);
  }
}

async function unfriend(req, res, next) {
  try {
    if (
      req.query.unfriend &&
      req.query.unfriend === "true" &&
      req.params.id &&
      req.query.chatUserId &&
      req.query.chatUserId !== ""
    ) {
      const acceptedInvitation = await prisma.friendRequest.findFirst({
        where: {
          id: Number(req.params.id),
          status: "accepted",
        },
      });

      if (!acceptedInvitation) {
        return res.json(null);
      }

      const friends = await prisma.friend.findMany({
        where: {
          OR: [
            {
              loginuserId: req.user.id,
              friendId: Number(req.query.chatUserId),
            },
            {
              loginuserId: Number(req.query.chatUserId),
              friendId: req.user.id,
            },
          ],
        },
      });

      if (friends.length < 2) {
        return res.json(nul);
      }

      await prisma.friend.updateMany({
        where: {
          OR: [
            {
              loginuserId: req.user.id,
              friendId: Number(req.query.chatUserId),
            },
            {
              loginuserId: Number(req.query.chatUserId),
              friendId: req.user.id,
            },
          ],
        },
        data: {
          status: "stranger",
        },
      });

      const unfriendInvitation = await prisma.friendRequest.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          status: "unfriend",
        },
      });

      return res.json(unfriendInvitation);
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  getfriendRequest,
  create,

  revokeInvitation,
  getReceivingInvitations,
  getByChatUserId,
  rejectInvitation,
  acceptInvitation,
  unfriend,
};

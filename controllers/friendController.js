const { prisma } = require("../config/helpers");

async function getByAuthId(req, res, next) {
  try {
    if (req.query.auth && req.query.auth === "true") {
      const friends = await prisma.friend.findMany({
        where: {
          loginuserId: req.user.id,
          status: "friends",
        },
        include: {
          friend: true,
        },
      });

      const friendList = friends.map((friend) => {
        return {
          id: friend.friend.id,
          name: friend.friend.name,
          avatarPath: friend.friend.avatarPath,
          status: friend.status,
        };
      });

      return res.json(friendList);
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getByAuthId,
};

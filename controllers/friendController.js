const { PrismaClient } = require("../generated/prisma");

const primsa = new PrismaClient();

async function getByAuthId(req, res, next) {
  try {
    if (req.query.auth && req.query.auth === "true") {
      const friends = await primsa.friend.findMany({
        where: {
          loginuserId: req.user.id,
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

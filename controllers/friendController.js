const { PrismaClient } = require("../generated/prisma");

const primsa = new PrismaClient();

async function getByAuthId(req, res, next) {
  try {
    if (req.query.auth && req.query.auth === "true") {
      const friends = await primsa.friend.findMany({
        where: {
          loginuserId: req.user.id,
        },
      });

      return res.json(friends);
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getByAuthId,
};

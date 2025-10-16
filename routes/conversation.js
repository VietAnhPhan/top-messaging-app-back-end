const { Router } = require("express");
const { param, validationResult } = require("express-validator");
const passport = require("passport");

const conversationController = require("../controllers/conversationController");

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

const sendValidationResults = (req, res, next) => {
  const validations = validationResult(req);
  if (!validations.isEmpty()) {
    res.status(400).json({
      errors: validations.array(),
    });
  }
  next();
};

router.use(
  "/:id",
  param("id").isNumeric().withMessage("Conversation Id should be a number"),
  sendValidationResults
);

router.post("/", conversationController.createConversation);

router.get(
  "{userId=:userId}",
  conversationController.getAllConversationsByUserId
);

router.get(
  "{userIds=:userIds&friendId=:friendId}",
  conversationController.getAllByUserIdsAndFriendId
);

router.get("{userIds=:userIds}", conversationController.getCurrentConversation);

router.get("/", conversationController.getAllConversations);

module.exports = router;

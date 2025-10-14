const { Router } = require("express");
const { param, validationResult } = require("express-validator");
const passport = require("passport");

const messageController = require("../controllers/messageController");

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
  param("id").isNumeric().withMessage("Message Id should be a number"),
  sendValidationResults
);

router.post("/", messageController.createMessage);

router.get("/:id", messageController.getUser);

router.put("/:id", messageController.updateUser);

router.delete("/:id", messageController.deleteUser);

router.get("{userId=:userId}", messageController.getAllConversationsByUserId);

router.get("/", messageController.getAllMessages);

module.exports = router;

const { Router } = require("express");
const { param, validationResult } = require("express-validator");
const passport = require("passport");

const chatMemberController = require("../controllers/chatMemberController");

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
  param("id").isNumeric().withMessage("Chat Id should be a number"),
  sendValidationResults
);

router.post("/", chatMemberController.createChatMember);

router.get("/:id", chatMemberController.getchatMember);

router.get("/", chatMemberController.getAllChatMembers);

module.exports = router;

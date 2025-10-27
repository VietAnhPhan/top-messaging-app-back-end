const { Router } = require("express");
const { param, validationResult } = require("express-validator");
const passport = require("passport");

const friendRequestController = require("../controllers/friendRequestController");

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
  param("id").isNumeric().withMessage("Friend request Id should be a number"),
  sendValidationResults
);

router.post("/", friendRequestController.create);

router.patch("/:id{revoke}", friendRequestController.revokeInvitation);

router.patch("/:id{reject}", friendRequestController.rejectInvitation);

// router.get("/:id", messageController.getUser);

// router.put("/:id", messageController.updateUser);

// router.delete("/:id", messageController.deleteUser);

router.get("{sent}", friendRequestController.getfriendRequest);

router.get("{receiving}", friendRequestController.getReceivingInvitations);

router.get("{chatUserId}", friendRequestController.getByChatUserId);

router.get("/", friendRequestController.getAll);

module.exports = router;

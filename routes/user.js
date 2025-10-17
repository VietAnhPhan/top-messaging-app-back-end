const { Router } = require("express");
const { param, validationResult } = require("express-validator");
const passport = require("passport");

const userController = require("../controllers/userController");
const multer = require("multer");

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

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.use(
  "/:id",
  param("id").isNumeric().withMessage("User Id should be a number"),
  sendValidationResults
);

router.get("/:id", userController.getUser);

router.put("/:id", upload.single("uploaded_avatar"), userController.updateUser);

router.delete("/:id", userController.deleteUser);

router.get("{username=:username&search=true}", userController.getAllUser);

module.exports = router;

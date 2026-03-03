const router = require("express").Router();
const {
  register,
  login,
  updateProfile,
  currentUser,
  controlLogout,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
router.get("/me", currentUser);
router.post("/logout", protect, controlLogout);
router.post("/register", register);
router.post("/login", login);
router.patch("/update-profile", updateProfile);

module.exports = router;

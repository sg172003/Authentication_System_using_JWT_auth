const express = require("express")
const { signup, login, refreshAccessToken ,logout } = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")
const User = require("../models/User")

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/refresh", refreshAccessToken)
router.post("/logout",logout)

// create a protected route for user profile
router.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password")

  res.json({
    name: user.name,
    email: user.email
  })
})

module.exports = router

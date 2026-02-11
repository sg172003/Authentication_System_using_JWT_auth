const express = require("express")
const { signup, login, refreshAccessToken } = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/refresh", refreshAccessToken)

// create a protected route for user profile
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Secured Route Accessed",
    user: req.user
  })
})

module.exports = router

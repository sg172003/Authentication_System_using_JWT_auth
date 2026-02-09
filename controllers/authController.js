const User = require("../models/User")
const bcrypt = require("bcrypt")
const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/token")

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const accessToken = generateAccessToken({
      userId: user._id
    })

    const refreshToken = generateRefreshToken({
      userId: user._id
    })

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { signup, login }

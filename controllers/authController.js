const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/token")

//signUp function 
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

//Login function
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

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const accessToken = generateAccessToken({
      userId: user._id
    })

    const refreshToken = generateRefreshToken({
      userId: user._id
    })

    user.refreshToken = refreshToken
    await user.save()


    res.status(200).json({
      message: "Login Successful",
      accessToken,
      refreshToken
    })


  }
  catch (error) {
    return res.status(500).json({ message: "Server Error", error })
  }
}

//Create new access token from Refresh Token
const refreshAccessToken = async (req, res) => {


  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh Token required" })
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    const newAccessToken = generateAccessToken(
      { userId: decoded.userId })

    res.status(200).json({
      accessToken: newAccessToken
    })
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired refresh token" })
  }
}

module.exports = {
  signup,
  login,
  refreshAccessToken
}
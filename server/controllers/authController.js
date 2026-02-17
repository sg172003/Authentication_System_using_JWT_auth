const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/token")

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

//signUp function 
const signup = async (req, res) => {
  try {
    const rawName = req.body?.name ?? ""
    const rawEmail = req.body?.email ?? ""
    const rawPassword = req.body?.password ?? ""

    const name = String(rawName).trim()
    const email = String(rawEmail).trim().toLowerCase()
    const password = String(rawPassword)

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email format" })
    }

    if (!STRONG_PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      })
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
    if (error?.code === 11000 && (error?.keyPattern?.email || error?.keyValue?.email)) {
      return res.status(409).json({ message: "User already exists" })
    }

    if (error?.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid signup data" })
    }

    console.error("Signup error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

//Login function
const login = async (req, res) => {

  try {
    const rawEmail = req.body?.email ?? ""
    const rawPassword = req.body?.password ?? ""
    const email = String(rawEmail).trim().toLowerCase()
    const password = String(rawPassword)

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email format" })
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

    const user = await User.findById(decoded.userId)

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Refresh token not recognized" })
    }

    const newAccessToken = generateAccessToken(
      { userId: decoded.userId })

    res.status(200).json({
      accessToken: newAccessToken
    })
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired refresh token" })
  }
}

//log out function
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if(!refreshToken){
      return res.status(400).json({message:"Refresh token required"})
    }

const decoded = jwt.verify(refreshToken , process.env.JWT_REFRESH_SECRET)

const user = await User.findById(decoded.userId)

if (!user){
  return res.status(404).json({message:"User not found "})
}

//delte the existing refresh token 
user.refreshToken =null
await user.save()

return res.status(200).json({message: "Logged out successfully"})


  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" })
  }
}

module.exports = {
  signup,
  login,
  refreshAccessToken,
  logout
}

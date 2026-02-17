import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import ToastMessage from "@/components/ui/toast-message"
import { getLoginErrorMessage, isValidEmail } from "@/lib/auth-validation"

const initialFormData = {
  email: "",
  password: ""
}

function Login() {
  const [formData, setFormData] = useState(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "info",
    duration: 4000
  })
  const navigate = useNavigate()

  const showToast = (message, type = "info", duration = 4000) => {
    setToast({
      open: true,
      message,
      type,
      duration
    })
  }

  const closeToast = () => {
    setToast((currentToast) => ({
      ...currentToast,
      open: false
    }))
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    }

    if (!payload.email || !payload.password) {
      showToast("All fields are required.", "error", 0)
      return
    }

    if (!isValidEmail(payload.email)) {
      showToast("Please enter a valid email address.", "error", 0)
      return
    }

    setIsSubmitting(true)

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        payload
      )

      const { accessToken, refreshToken } = res.data
      if (!accessToken || !refreshToken) {
        showToast("Login response is invalid. Please try again.", "error", 0)
        return
      }

      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)

      setFormData(initialFormData)
      navigate("/profile")
    } catch (err) {
      showToast(getLoginErrorMessage(err), "error", 0)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <ToastMessage
        open={toast.open}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onClose={closeToast}
      />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
        <Card className="w-full border-slate-200/80 shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription>
              Login to continue to your profile.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="pr-16"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Need an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-foreground underline underline-offset-4 hover:opacity-80"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default Login

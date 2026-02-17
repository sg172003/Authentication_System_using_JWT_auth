import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

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
import {
  getPasswordChecks,
  getSignupErrorMessage,
  isStrongPassword,
  isValidEmail
} from "@/lib/auth-validation"
import { cn } from "@/lib/utils"

const initialFormData = {
  name: "",
  email: "",
  password: ""
}

function Signup() {
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
  const passwordChecks = getPasswordChecks(formData.password)

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
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    }

    if (!payload.name || !payload.email || !payload.password) {
      showToast("All fields are required.", "error", 0)
      return
    }

    if (!isValidEmail(payload.email)) {
      showToast("Please enter a valid email address.", "error", 0)
      return
    }

    if (!isStrongPassword(payload.password)) {
      showToast(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
        "error",
        0
      )
      return
    }

    setIsSubmitting(true)

    try {
      await axios.post(
        "http://localhost:5000/api/auth/signup",
        payload
      )
      setFormData(initialFormData)
      showToast("Signup successful. Redirecting to login.", "success", 1200)
      setTimeout(() => {
        navigate("/login")
      }, 1200)
    } catch (err) {
      showToast(getSignupErrorMessage(err), "error", 0)
    } finally {
      setIsSubmitting(false)
    }
  }

  const passwordRuleItems = [
    {
      label: "At least 8 characters",
      passed: passwordChecks.minLength
    },
    {
      label: "One uppercase letter",
      passed: passwordChecks.uppercase
    },
    {
      label: "One lowercase letter",
      passed: passwordChecks.lowercase
    },
    {
      label: "One number",
      passed: passwordChecks.number
    },
    {
      label: "One special character",
      passed: passwordChecks.special
    }
  ]

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
              Create your account
            </CardTitle>
            <CardDescription>
              Sign up to access your dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
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
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="pr-16"
                    minLength={8}
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$"
                    title="Use 8+ characters with uppercase, lowercase, number, and special character."
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
                <div className="space-y-1 pt-1">
                  {passwordRuleItems.map((rule) => (
                    <p
                      key={rule.label}
                      className={cn(
                        "text-xs",
                        rule.passed ? "text-emerald-700" : "text-muted-foreground"
                      )}
                    >
                      {rule.label}
                    </p>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-foreground underline underline-offset-4 hover:opacity-80"
              >
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default Signup

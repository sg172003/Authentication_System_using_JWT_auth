export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function getPasswordChecks(password) {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  }
}

export function isStrongPassword(password) {
  const checks = getPasswordChecks(password)

  return (
    checks.minLength &&
    checks.uppercase &&
    checks.lowercase &&
    checks.number &&
    checks.special
  )
}

export function getApiErrorMessage(error, fallbackMessage, statusMessages = {}) {
  if (!error.response) {
    return "Unable to reach the server. Please check your connection."
  }

  const backendMessage = error.response?.data?.message
  if (typeof backendMessage === "string" && backendMessage.trim().length > 0) {
    return backendMessage
  }

  const status = error.response.status
  if (statusMessages[status]) {
    return statusMessages[status]
  }

  if (status >= 500) {
    return "Server error. Please try again in a moment."
  }

  return fallbackMessage
}

export function getSignupErrorMessage(error) {
  return getApiErrorMessage(error, "Signup failed.", {
    400: "Please check your input and try again.",
    409: "User already exists. Please login with this email.",
    429: "Too many attempts. Please try again later."
  })
}

export function getLoginErrorMessage(error) {
  return getApiErrorMessage(error, "Login failed.", {
    400: "All fields are required.",
    401: "Invalid email or password.",
    429: "Too many attempts. Please try again later."
  })
}

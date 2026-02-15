import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Profile() {
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = localStorage.getItem("accessToken")

      if (!accessToken) {
        navigate("/login")
        return
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        )

        setUserData(res.data)
      } catch (err) {
        setError("Session expired. Please login again.")
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        navigate("/login")
      }
    }

    fetchProfile()
  }, [navigate])

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>
  }

  if (!userData) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h2>Profile Dashboard</h2>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </div>
  )
}

export default Profile

import { useEffect, useState } from "react"
import api from "../services/api"
import { useNavigate } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

function Profile() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile")
        setUser(res.data)
      } catch {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        navigate("/login")
      }
    }

    fetchProfile()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    navigate("/login")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  const avatarLetter = user.name?.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-semibold">
              {avatarLetter}
            </div>
            <div>
              <h1 className="text-3xl font-semibold">
                Welcome back, {user.name}
              </h1>
              <p className="text-muted-foreground text-sm">
                Here’s your account overview
              </p>
            </div>
          </div>

          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Separator />

        <div className="grid md:grid-cols-2 gap-6">

          <Card className="shadow-sm hover:shadow-md transition">
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <Badge>{user.name}</Badge>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <Badge variant="secondary">{user.email}</Badge>
              </div>

            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition">
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="flex justify-between">
                <span className="text-muted-foreground">Access Token</span>
                <Badge variant="outline">Valid</Badge>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Refresh Token</span>
                <Badge variant="outline">Stored</Badge>
              </div>

            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  )
}

export default Profile

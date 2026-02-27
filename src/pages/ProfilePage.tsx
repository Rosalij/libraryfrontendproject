import React from 'react'
import {useAuth} from "../context/AuthContext"
function ProfilePage() {
    const {user} = useAuth()
  return (
    <div>
      <h1>Your Profile</h1>
      <h2>Welcome, {user ? user.username : ""}</h2>
    </div>
  )
}

export default ProfilePage

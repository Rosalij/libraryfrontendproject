import React from "react";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Your Profile</h1>

      <h2>Welcome, {user?.username}</h2>
      <p>Email: {user?.email}</p>

      <h3>Your Reviews</h3>
      <p>You have not written any reviews yet.</p>
    </div>
  );
}

export default ProfilePage;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types/auth.types";

const UserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, token } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const res = await fetch(
          `https://librarybackend-c0p9.onrender.com/api/users/${id}`,
       
        );

        if (!res.ok) throw new Error("Failed to fetch user");
        const data: User = await res.json();
        setUser(data);

        // Optionally check if user is saved
        if (currentUser) {
          const meRes = await fetch(
            `https://librarybackend-c0p9.onrender.com/api/users/me/saved`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (meRes.ok) {
            const savedUsers: User[] = await meRes.json();
            setSaved(savedUsers.some((u) => u._id === id));
          }
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error loading user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, token, currentUser]);

  const handleSaveToggle = async () => {
    if (!token || !id) return;

    try {
      const method = saved ? "DELETE" : "POST";
      const res = await fetch(
        `https://librarybackend-c0p9.onrender.com/api/users/${id}/save`,
        {
          method,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to update saved users");
      setSaved(!saved);
    } catch (err) {
      console.error(err);
      alert("Error saving user");
    }
  };

  if (loading) return <p>Loading user profile...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h1>{user.username}</h1>
      <p>Joined: {new Date(user.createdAt!).toLocaleDateString()}</p>

      {currentUser && currentUser._id !== user._id && (
        <button onClick={handleSaveToggle}>
          {saved ? "Remove from saved" : "Save user"}
        </button>
      )}
    </div>
  );
};

export default UserPage;

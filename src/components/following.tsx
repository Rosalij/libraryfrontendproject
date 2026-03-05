// components/FollowingList.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types/auth.types";

interface FollowingListProps {
  onFollowChange?: () => void; // optional callback when a user is unfollowed
}

const FollowingList: React.FC<FollowingListProps> = ({ onFollowChange }) => {
  const  token  = localStorage.getItem("token");
  const [savedUsers, setSavedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch saved users
  useEffect(() => {
    const fetchSavedUsers = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const res = await fetch(
          "https://librarybackend-c0p9.onrender.com/api/users/me/saved",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch followed users");
        const data: User[] = await res.json();
        setSavedUsers(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error loading followed users");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedUsers();
  }, [token]);

  // Unfollow a user
  const handleUnfollow = async (userId: string) => {
    if (!token) return;

    try {
      const res = await fetch(
        `https://librarybackend-c0p9.onrender.com/api/users/${userId}/save`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to unfollow user");

      setSavedUsers((prev) => prev.filter((u) => u._id !== userId));

      if (onFollowChange) onFollowChange(); // notify parent
    } catch (err) {
      console.error(err);
      alert("Error unfollowing user");
    }
  };

  if (loading) return <p>Loading followed users...</p>;
  if (error) return <p>{error}</p>;
  if (savedUsers.length === 0) return <p>You are not following anyone yet.</p>;

  return (
    <div>
      {savedUsers.map((u) => (
        <div
          key={u._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.8rem 1rem",
            marginBottom: "0.5rem",
            backgroundColor: "white",
            borderRadius: "1.5rem",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <Link
            to={`/user/${u._id}`}
            style={{
              fontWeight: 600,
              color: "#111",
              textDecoration: "none",
            }}
          >
            {u.username}
          </Link>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <small style={{ color: "#888" }}>
              Joined {new Date(u.createdAt!).toLocaleDateString()}
            </small>
            <button
              onClick={() => handleUnfollow(u._id)}
              style={{
                padding: "0.3rem 0.8rem",
                cursor: "pointer",
                borderRadius: "1rem",
                backgroundColor: "#f5a623",
                color: "white",
                border: "none",
                fontSize: "0.85rem",
              }}
            >
              Unfollow
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowingList;

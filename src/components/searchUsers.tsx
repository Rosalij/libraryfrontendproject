import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types/auth.types";

const token = localStorage.getItem("token")
const searchUsers: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [savedUsers, setSavedUsers] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all users and current user's saved users
  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setLoading(true);

        // All users
        const res = await fetch(
          "https://librarybackend-c0p9.onrender.com/api/users",
          {
            signal: controller.signal,
          }
        );
        if (!res.ok) throw new Error("Failed to fetch users");
        const data: User[] = await res.json();

        // Remove yourself from the list
        const filtered = data.filter((u) => u._id !== currentUser?._id);
        setUsers(filtered);

        // Current user's saved users
        if (currentUser) {
          const savedRes = await fetch(
            "https://librarybackend-c0p9.onrender.com/api/users/me/saved",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (savedRes.ok) {
            const saved: User[] = await savedRes.json();
            setSavedUsers(saved.map((u) => u._id));
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(err.message || "Failed to load users");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    return () => controller.abort();
  }, [token, currentUser]);

  // Filter users by search
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => u.username.toLowerCase().includes(q));
  }, [search, users]);

  // Follow / unfollow a user
  const toggleFollow = async (userId: string) => {
    if (!token) return;

    try {
      const method = savedUsers.includes(userId) ? "DELETE" : "POST";
      const res = await fetch(
        `https://librarybackend-c0p9.onrender.com/api/users/${userId}/save`,
        {
          method,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to update saved users");

      setSavedUsers((prev) =>
        method === "POST"
          ? [...prev, userId]
          : prev.filter((id) => id !== userId)
      );
    } catch (err) {
      console.error(err);
      alert("Error updating follow status");
    }
  };

  return (
    <div style={{ maxWidth: "20em", margin: "3rem auto", padding: "2rem", display: "flex",

        flexDirection: "column"
     }}>
      <h1>All Users</h1>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "0.6rem",
          margin: "1rem 0 2rem",
          fontSize: "1rem",
        }}
      />

      {loading && <p>Loading users...</p>}
      {error && <p>{error}</p>}
      {!loading && filteredUsers.length === 0 && <p>No users found.</p>}

      {filteredUsers.map((u) => {
        const isFollowing = savedUsers.includes(u._id);
        return (
          <div
            key={u._id}
            style={{
              padding: "1rem",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height:" 4em",
                backgroundColor: "white",
borderRadius: "2em",
width: "100%"
            }}
          >
            <Link
              to={`/user/${u._id}`}
              style={{
                fontWeight: 400,
                fontSize: "1.1rem",
                color: "#111",
                display: "flex",
                textDecoration: "none"
              }}
            >
              <img src="/src/assets/account_circle.svg" alt="icon" width="25px"></img>{u.username}
            </Link>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>


              {currentUser && (
                <button
                  onClick={() => toggleFollow(u._id)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    margin: "auto"
                  }}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default searchUsers;

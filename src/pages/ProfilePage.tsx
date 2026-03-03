import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

interface Review {
  _id: string;
  bookId: string;
  reviewText: string;
  rating: number;
  createdAt: string;
  bookTitle?: string;
  thumbnail?: string;
}

function ProfilePage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReviews = async () => {
      if (!token) return;

      try {
        const res = await fetch(
          "https://librarybackend-c0p9.onrender.com/api/user/my-reviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        const enriched = await Promise.all(
          data.map(async (review: Review) => {
            try {
              const bookRes = await fetch(
                `https://librarybackend-c0p9.onrender.com/api/books/${review.bookId}`
              );
              const bookData = await bookRes.json();

              return {
                ...review,
                bookTitle: bookData.volumeInfo?.title || "Unknown Title",
                thumbnail:
                  bookData.volumeInfo?.imageLinks?.thumbnail || "",
              };
            } catch {
              return review;
            }
          })
        );

        setReviews(enriched);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token]);

  const renderStars = (rating: number) => {
    return (
      <span style={{ color: "#f5a623", fontSize: "1rem" }}>
        {[1, 2, 3, 4, 5].map((star) =>
          star <= rating ? "★" : "☆"
        )}
      </span>
    );
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "3rem auto",
        padding: "2rem",
        fontFamily: "Georgia, serif",
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>Your Profile</h1>

      <div style={{ marginBottom: "2rem" }}>
        <h2>Welcome, {user?.username}</h2>
        <p style={{ color: "#666" }}>Email: {user?.email}</p>
      </div>

      <h3 style={{ marginBottom: "1.5rem" }}>Your Reviews</h3>

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>You have not written any reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div
            key={r._id}
            style={{
              display: "flex",
              gap: "1.5rem",
              padding: "1.5rem 0",
              borderBottom: "1px solid #eee",
              alignItems: "center",
            }}
          >
            <img
              src={r.thumbnail || "/placeholder.jpg"}
              alt={r.bookTitle}
              style={{
                width: "80px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "6px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              }}
            />

            <div style={{ flex: 1 }}>
              <Link
                to={`/books/${r.bookId}`}
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  color: "#111",
                }}
              >
                {r.bookTitle}
              </Link>

              <div style={{ margin: "0.5rem 0" }}>
                {renderStars(r.rating)}
              </div>

              <p style={{ marginBottom: "0.5rem" }}>
                {r.reviewText}
              </p>

              <span style={{ fontSize: "0.85rem", color: "#888" }}>
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ProfilePage;

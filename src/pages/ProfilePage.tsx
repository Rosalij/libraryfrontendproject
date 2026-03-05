import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import StarRating from "../components/StarRating";

interface Review {
  _id: string;
  bookId: string;
  reviewText: string;
  rating: number;
  createdAt: string;
}

interface BookData {
  title: string;
  thumbnail: string;
}

function ProfilePage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [books, setBooks] = useState<Record<string, BookData>>({});
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReviews = async () => {
      if (!token) return;

      try {
        const res = await fetch(
          "https://librarybackend-c0p9.onrender.com/api/reviews/my-reviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const reviewData = await res.json();
        setReviews(reviewData);

        // 🔥 Hämta unika bookIds
        const uniqueBookIds = [
          ...new Set(reviewData.map((r: Review) => r.bookId)),
        ];

        const bookResults = await Promise.all(
          uniqueBookIds.map(async (id: string) => {
            try {
              const res = await fetch(
                `https://librarybackend-c0p9.onrender.com/api/books/${id}`
              );
              const data = await res.json();

              return {
                id,
                title: data.volumeInfo?.title || "Unknown Title",
                thumbnail:
                  data.volumeInfo?.imageLinks?.thumbnail || "",
              };
            } catch {
              return {
                id,
                title: "Unknown Title",
                thumbnail: "",
              };
            }
          })
        );

        const bookMap: Record<string, BookData> = {};
        bookResults.forEach((b) => {
          bookMap[b.id] = {
            title: b.title,
            thumbnail: b.thumbnail,
          };
        });

        setBooks(bookMap);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token]);

  const startEditing = (review: Review) => {
    setEditingId(review._id);
    setEditText(review.reviewText);
    setEditRating(review.rating);
  };

  const handleUpdate = async (id: string) => {
    if (!token) return;

    try {
      const res = await fetch(
        `https://librarybackend-c0p9.onrender.com/api/reviews/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reviewText: editText,
            rating: editRating,
          }),
        }
      );

      const updated = await res.json();

      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, ...updated } : r))
      );

      setEditingId(null);
    } catch {
      console.error("Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmDelete) return;

    try {
      await fetch(
        `https://librarybackend-c0p9.onrender.com/api/reviews/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch {
      console.error("Delete failed");
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "3rem auto", padding: "2rem", backgroundColor:"#e6e6e6", borderRadius: "2em"}}>
      <h1>Your Profile</h1>
      <h2>Welcome to your book collection, {user?.username}</h2>
<br /> <h3>Your reviews:</h3>
      {loading ? (
        <p>Loading...</p>
      ) : reviews.length === 0 ? (
        <p>You have not written any reviews yet.</p>
      ) : (
        reviews.map((r) => {
          const book = books[r.bookId];

          return (
            <div
              key={r._id}
              style={{
                display: "flex",
                gap: "1.5rem",
                padding: "1.5rem 0",
                borderBottom: "1px solid #000000",
              }}
            >
              <img
                src={book?.thumbnail || "/placeholder.jpg"}
                alt={book?.title}
                style={{
                  width: "100px",
                  objectFit: "contain",
    
                }}
              />

              <div style={{ flex: 1 }}>
                <Link to={`/book/${r.bookId}`} style={{color:"black"}}>
                  {book?.title || "Unknown Title"}
                </Link>

                {editingId === r._id ? (
                  <>
                    <StarRating
                      rating={editRating}
                      editable
                      onChange={(val) => setEditRating(val)}
                    />
<div>
                    <textarea style={{width: "30em", height: "10em", border: "none", fontFamily:"manrope", margin: "1em"}}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
  </div>
                    <button style={{ marginRight: "3em", width: "7em", color: "white" }} onClick={() => handleUpdate(r._id)}>
                      Save
                    </button>
                    <button style={{width: "7em", color: "white" }} onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                </>
                ) : (
                  <>
                    <StarRating rating={r.rating} />
                    <p>{r.reviewText}</p>
                    <small>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </small>

                    <div style={{display:"flex", justifyContent:"space-around"}}>
                      <button style={{width: "7em"}}onClick={() => startEditing(r)}>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        style={{width: "7em", color: "white" }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ProfilePage;

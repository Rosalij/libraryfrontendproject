import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import StarRating from "./StarRating";

interface Review {
  _id: string;
  reviewText: string;
  rating: number;
  user: { username: string } | null;
}

interface BookReviewsProps {
  bookId: string;
}

const BookReviews: React.FC<BookReviewsProps> = ({ bookId }) => {
  const { user } = useAuth(); // logged-in user
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); // JWT

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://librarybackend-c0p9.onrender.com/api/reviews/${bookId}`
        );
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
        setError("Error loading reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [bookId]);

  // Submit a new review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !token) {
      alert("You must be logged in to submit a review");
      return;
    }

    if (!newReview.trim()) {
      alert("Review cannot be empty");
      return;
    }

    try {
      const res = await fetch(
        "https://librarybackend-c0p9.onrender.com/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookId,
            reviewText: newReview,
            rating: newRating,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to submit review");
      const data = await res.json();

      // Add current user's username to the new review
      const reviewWithUser = { ...data, user: { username: user.username } };

      setReviews([reviewWithUser, ...reviews]);
      setNewReview("");
      setNewRating(5);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review");
    }
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Reviews ({reviews.length})</h2>

      {/* Review form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          rows={3}
          placeholder="Write your review..."
          style={{ width: "100%", padding: "0.5rem" }}
          required
        />
        <div style={{ margin: "0.5rem 0" }}>
          <p>Rate this book:</p>
         <StarRating
  rating={newRating}
  editable
  onChange={(val) => setNewRating(val)}
/>
       
        </div>
        <button type="submit">Submit Review</button>
      </form>

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first!</p>
      ) : (
        reviews.map((r) => (
          <div
            key={r._id}
            style={{ borderTop: "1px solid #ccc", padding: "0.5rem 0" }}
          >
            <strong>{r.user?.username || "Unknown"}</strong> ({r.rating} ⭐)
            <p>{r.reviewText}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default BookReviews;

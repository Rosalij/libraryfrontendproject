import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Review {
  _id: string;
  bookId: string;
  reviewText: string;
  rating: number;
  user: { username: string } | null;
}

interface ReviewWithBook extends Review {
  thumbnail?: string;
  title?: string;
}

const LatestReviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewWithBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(
          "https://librarybackend-c0p9.onrender.com/api/reviews/latest"
        );
        const reviewData: Review[] = await res.json();

        // Fetch book data for each review
        const reviewsWithBooks = await Promise.all(
          reviewData.map(async (review) => {
            try {
              const bookRes = await fetch(
                `https://librarybackend-c0p9.onrender.com/api/books/${review.bookId}`
              );
              const bookData = await bookRes.json();

              return {
                ...review,
                thumbnail:
                  bookData.volumeInfo?.imageLinks?.thumbnail || "",
                title: bookData.volumeInfo?.title || "Unknown Title",
              };
            } catch {
              return { ...review };
            }
          })
        );

        setReviews(reviewsWithBooks);
      } catch (err) {
        console.error("Failed to fetch latest reviews", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  if (loading) return <p>Loading latest reviews...</p>;

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
    <div style={{ marginTop: "2rem" }}>
      <h2>Latest Reviews</h2>

      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div
            key={r._id}
            style={{
              display: "flex",
              gap: "1rem",
              borderBottom: "1px solid #ccc",
              padding: "1rem 0",
              alignItems: "center",
            }}
          >
            {/* Book Image */}
            <img
              src={r.thumbnail || "./placeholder.jpg"}
              alt={r.title}
              style={{ width: "80px", height: "120px", objectFit: "cover" }}
            />

            {/* Review Info */}
            <div>
              <h4>{r.title}</h4>
           <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
  <strong>{r.user?.username || "Unknown"}</strong>
  {renderStars(r.rating)}
</div>

              <p>{r.reviewText}</p>

              <Link to={`/book/${r.bookId}`} style={{color: "black"}}>
                View Book →
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LatestReviews;

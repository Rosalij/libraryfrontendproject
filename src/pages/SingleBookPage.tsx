import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewComponent from "../components/ReviewComponent";

interface Book {
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: { thumbnail?: string };
    publishedDate?: string;
    publisher?: string;
    pageCount?: number;
  };
}

function SingleBookPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return;
      try {
        const res = await fetch(
          `https://librarybackend-c0p9.onrender.com/api/books/${bookId}`
        );
        const data = await res.json();
        if (!data.volumeInfo) {
          setBook(null);
        } else {
          setBook(data);
        }
      } catch {
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  if (loading) return <div style={{ padding: "3rem" }}>Loading...</div>;
  if (!book) return <div style={{ padding: "3rem" }}>Book not found</div>;

  const description =
    book.volumeInfo.description || "No description available";

  const shortDescription =
    description.length > 800
      ? description.substring(0, 800) + "..."
      : description;

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "3rem auto",
        padding: "2rem",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "3rem",
          alignItems: "flex-start",
        }}
      >
        <img
          src={
            book.volumeInfo.imageLinks?.thumbnail || "/placeholder.jpg"
          }
          alt={book.volumeInfo.title}
          style={{
            width: "260px",
            height: "390px",
            objectFit: "cover",
            borderRadius: "8px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}
        />

        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "2.2rem",
              marginBottom: "0.5rem",
              fontWeight: 600,
            }}
          >
            {book.volumeInfo.title}
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              color: "#555",
              marginBottom: "1rem",
            }}
          >
            {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
          </p>

          <div
            style={{
              fontSize: "0.95rem",
              color: "#777",
              marginBottom: "1.5rem",
            }}
          >
            {book.volumeInfo.publisher && (
              <div>Publisher: {book.volumeInfo.publisher}</div>
            )}
            {book.volumeInfo.publishedDate && (
              <div>Published: {book.volumeInfo.publishedDate}</div>
            )}
            {book.volumeInfo.pageCount && (
              <div>Pages: {book.volumeInfo.pageCount}</div>
            )}
          </div>

          <div
            style={{
              lineHeight: 1.7,
              fontSize: "1rem",
              color: "#333",
            }}
            dangerouslySetInnerHTML={{
              __html: expanded ? description : shortDescription,
            }}
          />

          {description.length > 800 && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                border: "none",
                background: "#111",
                color: "white",
                cursor: "pointer",
                borderRadius: "4px",
                fontSize: "0.9rem",
              }}
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>
      </div>

      <div style={{ marginTop: "4rem" }}>
        <ReviewComponent bookId={bookId || ""} />
      </div>
    </div>
  );
}

export default SingleBookPage;

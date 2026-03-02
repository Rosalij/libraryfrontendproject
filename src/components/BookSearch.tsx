import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: { thumbnail?: string };
  };
}

function BookSearch() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  const maxResults = 8;

  const fetchBooks = async (newStartIndex: number) => {
    if (!query) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://librarybackend-c0p9.onrender.com/api/books/search?q=${encodeURIComponent(query)}&startIndex=${newStartIndex}`
      );
      const data = await res.json();

      if (!data.items || data.items.length === 0) {
        setBooks([]);
        setError("No books found");
        setTotalItems(0);
        return;
      }

      setBooks(data.items);
      setTotalItems(data.totalItems || 0);
      setStartIndex(newStartIndex);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks(0);
  };

  const handlePrev = () => fetchBooks(Math.max(0, startIndex - maxResults));
  const handleNext = () => fetchBooks(startIndex + maxResults);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Search Books</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter book title or author"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "0.5rem", width: "20%" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
          gap: "1rem",
        }}
      >
        {books.map((book) => (
          <div
            key={book.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              textAlign: "center",
              backgroundColor: "#f9f9f9",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "1rem",
              alignItems: "center",
            }}
          >
            <img
              src={book.volumeInfo.imageLinks?.thumbnail || "/placeholder.jpg"}
              alt={book.volumeInfo.title}
              style={{ width: "110px", height: "130px", objectFit: "cover", marginBottom: "0.5rem" }}
            />
            <h4 style={{ fontSize: "0.9rem" }}>{book.volumeInfo.title}</h4>
            <p style={{ fontSize: "0.7rem", fontWeight: "600", color: "#555" }}>
              {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
            </p>
            <button
              onClick={() =>
                navigate(`/book/${book.id}`)
              }
            >
              More info & reviews⭐
            </button>
          </div>
        ))}
      </div>

      {books.length > 0 && (
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button onClick={handlePrev} disabled={startIndex === 0}>
            Previous
          </button>
          <button onClick={handleNext} disabled={startIndex + maxResults >= totalItems}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default BookSearch;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewComponent from "../components/ReviewComponent";

interface Book {
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: { thumbnail?: string };
  };
}

function SingleBookPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return;
      try {
        const res = await fetch(
           `https://librarybackend-c0p9.onrender.com/api/books/${bookId}`
        );
        const data = await res.json();

        // Some items might not have volumeInfo, add a check
        if (!data.volumeInfo) {
          console.error("Book has no volumeInfo", data);
          setBook(null);
        } else {
          setBook(data);
        }
      } catch (err) {
        console.error("Error fetching book:", err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found</p>;

  return (<>
    <div> <ReviewComponent bookId={bookId || ""} />
 </div>
    <div>
      <h1>{book.volumeInfo.title}</h1>
      <p>{book.volumeInfo.authors?.join(", ") || "Unknown Author"}</p>
      <img
        src={book.volumeInfo.imageLinks?.thumbnail || "/placeholder.jpg"}
        alt={book.volumeInfo.title}
      />
      <p>{book.volumeInfo.description || "No description available"}</p>
    </div></>
  );
}

export default SingleBookPage;

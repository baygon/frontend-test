import { useState } from "react";
import { SearchResult, getCoverUrl } from "../services/openLibraryApi";
import { useBookDetails } from "../hooks/useBookDetails";

interface BookCardProps {
  book?: SearchResult;
  isbn?: string;
}

export default function BookCard({ book, isbn }: BookCardProps) {
  const [hovered, setHovered] = useState(false);

  const {
    book: isbnDetails,
    loading: isbnLoading,
    error: isbnError,
  } = useBookDetails(isbn);

  const searchIsbn = book?.isbn?.[0];
  const { book: searchDetails, loading: searchLoading } = useBookDetails(
    hovered ? searchIsbn : undefined,
  );

  // Single book display
  if (isbn) {
    if (isbnLoading) {
      return <div className="book-display loading">Loading...</div>;
    }

    if (isbnError || !isbnDetails) {
      return (
        <div className="book-display error">
          {isbnError || "Book not found"}
        </div>
      );
    }

    return (
      <div className="book-display">
        {isbnDetails.coverUrl && (
          <img
            src={isbnDetails.coverUrl}
            alt={`Cover of ${isbnDetails.title}`}
            className="book-cover"
          />
        )}
        <div className="book-info">
          <h2>{isbnDetails.title}</h2>
          <p>
            <strong>Authors:</strong>{" "}
            {isbnDetails.authors.join(", ") || "Unknown"}
          </p>
          <p>
            <strong>Publish Date:</strong> {isbnDetails.publishDate}
          </p>
          <p>
            <strong>Format:</strong> {isbnDetails.physicalFormat}
          </p>
        </div>
      </div>
    );
  }

  // Search result card (circular cover + hover overlay)
  if (book) {
    const coverUrl = book.cover_i ? getCoverUrl(book.cover_i, "L") : "";
    const isOverlayLoading = Boolean(searchIsbn) && searchLoading;

    return (
      <div
        className="book-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        tabIndex={0}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`Cover of ${book.title}`}
            className="book-card-cover"
          />
        ) : (
          <div className="book-card-cover book-card-cover-placeholder">
            <span>No image</span>
          </div>
        )}
        <p className="book-card-title">{book.title}</p>

        {hovered && (
          <div className="book-overlay">
            {isOverlayLoading ? (
              <div className="overlay-loading">Loading details...</div>
            ) : searchDetails ? (
              <div className="overlay-info">
                {(searchDetails.coverUrl || coverUrl) && (
                  <img
                    src={searchDetails.coverUrl || coverUrl}
                    alt={`Large cover of ${searchDetails.title}`}
                    className="overlay-cover"
                  />
                )}
                <h3>{searchDetails.title}</h3>
                <p>
                  <strong>Authors:</strong>{" "}
                  {searchDetails.authors.join(", ") || "Unknown"}
                </p>
                <p>
                  <strong>Publish Date:</strong> {searchDetails.publishDate}
                </p>
                <p>
                  <strong>Format:</strong> {searchDetails.physicalFormat}
                </p>
                {searchDetails.numberOfPages && (
                  <p>
                    <strong>Pages:</strong> {searchDetails.numberOfPages}
                  </p>
                )}
                {searchDetails.weight && (
                  <p>
                    <strong>Weight:</strong> {searchDetails.weight}
                  </p>
                )}
              </div>
            ) : (
              <div className="overlay-info">
                <h3>{book.title}</h3>
                <p>
                  <strong>Authors:</strong>{" "}
                  {book.author_name?.join(", ") || "Unknown"}
                </p>
                {book.first_publish_year && (
                  <p>
                    <strong>First Published:</strong> {book.first_publish_year}
                  </p>
                )}
                <p>
                  <em>No ISBN available for detailed info</em>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}

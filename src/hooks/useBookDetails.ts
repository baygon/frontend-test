import { useState, useEffect } from "react";
import { fetchBookByISBN, BookDetails } from "../services/openLibraryApi";

interface UseBookDetailsResult {
  book: BookDetails | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for fetching book details by ISBN.
 * Handles loading state, error handling, and cleanup on unmount.
 */
export function useBookDetails(isbn: string | undefined): UseBookDetailsResult {
  const [book, setBook] = useState<BookDetails | null>(null);
  const [loading, setLoading] = useState(!!isbn);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isbn) {
      setBook(null);
      setError(null);
      setLoading(false);
      return;
    }

    const resolvedIsbn = isbn;
    let cancelled = false;

    async function loadBook() {
      setLoading(true);
      setBook(null);
      setError(null);

      try {
        const bookData = await fetchBookByISBN(resolvedIsbn);

        if (cancelled) return;

        if (bookData) {
          setBook(bookData);
        } else {
          setError("Book not found");
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load book");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBook();

    return () => {
      cancelled = true;
    };
  }, [isbn]);

  return { book, loading, error };
}

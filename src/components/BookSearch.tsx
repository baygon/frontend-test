import { useState } from "react";
import { SearchResult, searchBooksByTitle } from "../services/openLibraryApi";
import BookCard from "./BookCard";

interface BookSearchProps {
  onSearch?: (query: string) => void;
}

export default function BookSearch({ onSearch }: BookSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedQuery = query.trim();
    if (!normalizedQuery) return;

    setLoading(true);
    setHasSearched(true);
    onSearch?.(normalizedQuery);

    try {
      const searchResults = await searchBooksByTitle(normalizedQuery);
      setResults(searchResults);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-search">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books by title..."
          className="search-input"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {loading && <div className="loading">Searching...</div>}

      <div className="search-results">
        {results.map((book) => (
          <BookCard key={book.key} book={book} />
        ))}
      </div>

      {!loading && hasSearched && results.length === 0 && (
        <p className="search-empty">No books found</p>
      )}
    </div>
  );
}

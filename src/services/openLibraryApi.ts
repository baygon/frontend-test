// Types for Open Library API responses
interface AuthorData {
  name: string;
  key?: string;
}

export interface BookDetails {
  coverUrl: string;
  title: string;
  authors: string[];
  publishDate: string;
  physicalFormat: string;
  numberOfPages?: number;
  weight?: string;
}

export interface SearchResult {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  isbn?: string[];
  first_publish_year?: number;
}

export interface SearchResponse {
  numFound: number;
  docs: SearchResult[];
}

// API Base URLs
const BOOK_API_BASE = "https://openlibrary.org/api/books";
const SEARCH_API_BASE = "https://openlibrary.org/search.json";
const COVER_BASE = "https://covers.openlibrary.org/b/id";

/**
 * Fetch detailed book information by ISBN
 */
export async function fetchBookByISBN(
  isbn: string,
): Promise<BookDetails | null> {
  try {
    const url = `${BOOK_API_BASE}?bibkeys=ISBN:${isbn}&jscmd=details&format=json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const bookKey = `ISBN:${isbn}`;

    if (!data[bookKey]) {
      return null;
    }

    const bookData = data[bookKey].details;

    // Extract cover URL
    const coverUrl = data[bookKey].thumbnail_url
      ? data[bookKey].thumbnail_url.replace("-S.jpg", "-L.jpg")
      : "";

    // Extract authors
    const authors =
      bookData.authors?.map((author: AuthorData) => author.name) || [];

    return {
      coverUrl,
      title: bookData.title || "Unknown Title",
      authors,
      publishDate: bookData.publish_date || "Unknown",
      physicalFormat: bookData.physical_format || "Unknown",
      numberOfPages: bookData.number_of_pages,
      weight: bookData.weight,
    };
  } catch (error) {
    console.error("Error fetching book by ISBN:", error);
    return null;
  }
}

/**
 * Search books by title
 */
export async function searchBooksByTitle(
  title: string,
): Promise<SearchResult[]> {
  try {
    const url = `${SEARCH_API_BASE}?title=${encodeURIComponent(title)}&fields=key,title,author_name,cover_i,isbn,first_publish_year`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SearchResponse = await response.json();
    return data.docs;
  } catch (error) {
    console.error("Error searching books:", error);
    return [];
  }
}

/**
 * Get cover image URL by cover ID
 */
export function getCoverUrl(
  coverId: number,
  size: "S" | "M" | "L" = "L",
): string {
  return `${COVER_BASE}/${coverId}-${size}.jpg`;
}

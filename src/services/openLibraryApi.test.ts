import { describe, it, expect, vi } from "vitest";
import {
  fetchBookByISBN,
  searchBooksByTitle,
  getCoverUrl,
} from "./openLibraryApi";

describe("openLibraryApi", () => {
  describe("getCoverUrl", () => {
    it("should generate correct cover URL", () => {
      const url = getCoverUrl(12345, "L");
      expect(url).toBe("https://covers.openlibrary.org/b/id/12345-L.jpg");
    });

    it("should default to large size", () => {
      const url = getCoverUrl(12345);
      expect(url).toBe("https://covers.openlibrary.org/b/id/12345-L.jpg");
    });
  });

  describe("fetchBookByISBN", () => {
    it("should fetch and transform book data correctly", async () => {
      const mockResponse = {
        "ISBN:9783442236862": {
          thumbnail_url: "https://covers.openlibrary.org/b/id/123-S.jpg",
          details: {
            title: "Test Book",
            authors: [{ name: "Author One" }, { name: "Author Two" }],
            publish_date: "2020",
            physical_format: "Paperback",
            number_of_pages: 300,
            weight: "400g",
          },
        },
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response),
      );

      const book = await fetchBookByISBN("9783442236862");

      expect(book).toEqual({
        coverUrl: "https://covers.openlibrary.org/b/id/123-L.jpg",
        title: "Test Book",
        authors: ["Author One", "Author Two"],
        publishDate: "2020",
        physicalFormat: "Paperback",
        numberOfPages: 300,
        weight: "400g",
      });
    });

    it("should return null when book not found", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        } as Response),
      );

      const book = await fetchBookByISBN("invalid");
      expect(book).toBeNull();
    });

    it("should handle fetch errors", async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

      const book = await fetchBookByISBN("9783442236862");
      expect(book).toBeNull();
    });
  });

  describe("searchBooksByTitle", () => {
    it("should fetch and return search results", async () => {
      const mockResponse = {
        numFound: 2,
        docs: [
          {
            key: "/works/1",
            title: "Book One",
            author_name: ["Author One"],
            cover_i: 123,
            isbn: ["1234567890"],
          },
          {
            key: "/works/2",
            title: "Book Two",
            cover_i: 456,
          },
        ],
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response),
      );

      const results = await searchBooksByTitle("test");

      expect(results).toHaveLength(2);
      expect(results[0].title).toBe("Book One");
    });

    it("should return all results from API response", async () => {
      const mockDocs = Array.from({ length: 50 }, (_, i) => ({
        key: `/works/${i}`,
        title: `Book ${i}`,
      }));

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ numFound: 50, docs: mockDocs }),
        } as Response),
      );

      const results = await searchBooksByTitle("test");
      expect(results).toHaveLength(50);
    });

    it("should return empty array on error", async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

      const results = await searchBooksByTitle("test");
      expect(results).toEqual([]);
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import BookCard from "./BookCard";
import * as api from "../services/openLibraryApi";

vi.mock("../services/openLibraryApi");

describe("BookCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ISBN mode (Task 2.1)", () => {
    it("should render book details in ISBN mode", async () => {
      const mockBookDetails = {
        coverUrl: "http://example.com/cover.jpg",
        title: "ISBN Book",
        authors: ["Author One", "Author Two"],
        publishDate: "2020",
        physicalFormat: "Paperback",
      };

      vi.mocked(api.fetchBookByISBN).mockResolvedValue(mockBookDetails);

      render(<BookCard isbn="9783442236862" />);

      expect(await screen.findByText("ISBN Book")).toBeInTheDocument();
      expect(screen.getByText(/Author One, Author Two/)).toBeInTheDocument();
      expect(screen.getByText(/2020/)).toBeInTheDocument();
      expect(screen.getByText(/Paperback/)).toBeInTheDocument();
    });

    it("should show loading state when fetching by ISBN", () => {
      vi.mocked(api.fetchBookByISBN).mockImplementation(
        () => new Promise<null>(() => {}), // Never resolves
      );

      render(<BookCard isbn="123" />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should show error when book not found by ISBN", async () => {
      vi.mocked(api.fetchBookByISBN).mockResolvedValue(null);

      render(<BookCard isbn="invalid" />);

      expect(await screen.findByText("Book not found")).toBeInTheDocument();
    });

    it("should handle missing cover in ISBN mode", async () => {
      const mockBookDetails = {
        coverUrl: "",
        title: "No Cover Book",
        authors: ["Author"],
        publishDate: "2020",
        physicalFormat: "Hardcover",
      };

      vi.mocked(api.fetchBookByISBN).mockResolvedValue(mockBookDetails);

      render(<BookCard isbn="123" />);

      expect(await screen.findByText("No Cover Book")).toBeInTheDocument();
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
  });

  describe("SearchResult mode (Task 2.2 + 2.3)", () => {
    const mockBook = {
      key: "/works/123",
      title: "Test Book",
      author_name: ["Test Author"],
      cover_i: 12345,
      isbn: ["9783442236862"],
    };

    beforeEach(() => {
      vi.mocked(api.getCoverUrl).mockReturnValue(
        "http://example.com/cover.jpg",
      );
    });

    it("should render circular cover and title immediately", () => {
      render(<BookCard book={mockBook} />);

      const cover = screen.getByAltText("Cover of Test Book");
      expect(cover).toHaveAttribute("src", "http://example.com/cover.jpg");
      expect(screen.getByText("Test Book")).toBeInTheDocument();
    });

    it("should show overlay with full details on hover", async () => {
      const mockBookDetails = {
        coverUrl: "http://example.com/full-cover.jpg",
        title: "Test Book Full",
        authors: ["Test Author"],
        publishDate: "January 1, 2020",
        physicalFormat: "Paperback",
        numberOfPages: 300,
        weight: "1.2 pounds",
      };

      vi.mocked(api.fetchBookByISBN).mockResolvedValue(mockBookDetails);

      render(<BookCard book={mockBook} />);

      // Hover over the card
      const card = screen.getByText("Test Book").closest(".book-card")!;
      fireEvent.mouseEnter(card);

      // Overlay should appear with full details
      await waitFor(() => {
        expect(
          screen.getByAltText("Large cover of Test Book Full"),
        ).toHaveAttribute("src", "http://example.com/full-cover.jpg");
        expect(
          screen.getByRole("heading", { name: "Test Book Full" }),
        ).toBeInTheDocument();
        expect(screen.getByText(/Authors:/)).toBeInTheDocument();
        expect(screen.getByText(/Publish Date:/)).toBeInTheDocument();
        expect(screen.getByText(/Format:/)).toBeInTheDocument();
        expect(screen.getByText(/Pages:/)).toBeInTheDocument();
        expect(screen.getByText(/Weight:/)).toBeInTheDocument();
      });
    });

    it("should hide overlay on mouse leave", async () => {
      const mockBookDetails = {
        coverUrl: "http://example.com/full-cover.jpg",
        title: "Test Book Full",
        authors: ["Test Author"],
        publishDate: "January 1, 2020",
        physicalFormat: "Paperback",
        numberOfPages: 300,
      };

      vi.mocked(api.fetchBookByISBN).mockResolvedValue(mockBookDetails);

      render(<BookCard book={mockBook} />);

      const card = screen.getByText("Test Book").closest(".book-card")!;

      // Hover
      fireEvent.mouseEnter(card);
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "Test Book Full" }),
        ).toBeInTheDocument();
      });

      // Leave
      fireEvent.mouseLeave(card);
      expect(
        screen.queryByRole("heading", { name: "Test Book Full" }),
      ).not.toBeInTheDocument();
    });

    it("should show loading in overlay while fetching details", () => {
      vi.mocked(api.fetchBookByISBN).mockImplementation(
        () => new Promise<null>(() => {}), // Never resolves
      );

      render(<BookCard book={mockBook} />);

      const card = screen.getByText("Test Book").closest(".book-card")!;
      fireEvent.mouseEnter(card);

      expect(screen.getByText("Loading details...")).toBeInTheDocument();
    });

    it("should show basic info in overlay when no ISBN", () => {
      const bookWithoutISBN = {
        ...mockBook,
        isbn: undefined,
        first_publish_year: 2020,
      };

      render(<BookCard book={bookWithoutISBN} />);

      const card = screen.getByText("Test Book").closest(".book-card")!;
      fireEvent.mouseEnter(card);

      expect(screen.getByText(/No ISBN available/)).toBeInTheDocument();
    });

    it("should handle missing cover gracefully", () => {
      const bookWithoutCover = {
        ...mockBook,
        cover_i: undefined,
      };

      vi.mocked(api.getCoverUrl).mockReturnValue("");

      render(<BookCard book={bookWithoutCover} />);

      expect(screen.getByText("Test Book")).toBeInTheDocument();
      expect(screen.getByText("No image")).toBeInTheDocument();
    });
  });
});

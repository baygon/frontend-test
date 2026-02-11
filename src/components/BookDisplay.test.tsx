import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BookDisplay from "./BookDisplay";
import * as api from "../services/openLibraryApi";

vi.mock("../services/openLibraryApi");

describe("BookDisplay", () => {
  it("should display book information when loaded", async () => {
    const mockBook = {
      coverUrl: "http://example.com/cover.jpg",
      title: "Test Book",
      authors: ["Author One", "Author Two"],
      publishDate: "2020",
      physicalFormat: "Paperback",
    };

    vi.mocked(api.fetchBookByISBN).mockResolvedValue(mockBook);

    render(<BookDisplay isbn="123" />);

    expect(await screen.findByText("Test Book")).toBeInTheDocument();
    expect(screen.getByText(/Author One, Author Two/)).toBeInTheDocument();
    expect(screen.getByText(/2020/)).toBeInTheDocument();
    expect(screen.getByText(/Paperback/)).toBeInTheDocument();
    expect(screen.getByAltText("Cover of Test Book")).toHaveAttribute(
      "src",
      "http://example.com/cover.jpg",
    );
  });

  it("should show error when book not found", async () => {
    vi.mocked(api.fetchBookByISBN).mockResolvedValue(null);

    render(<BookDisplay isbn="invalid" />);

    expect(await screen.findByText("Book not found")).toBeInTheDocument();
  });
});

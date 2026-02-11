import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookSearch from "./BookSearch";
import * as openLibraryApi from "../services/openLibraryApi";
import { SearchResult } from "../services/openLibraryApi";

// Mock the openLibraryApi module
vi.mock("../services/openLibraryApi");

describe("BookSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render search input and button", () => {
    render(<BookSearch />);

    expect(
      screen.getByPlaceholderText(/search books by title/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
    expect(screen.queryByText("No books found")).not.toBeInTheDocument();
  });

  it("should display search results after search", async () => {
    const mockResults = [
      {
        key: "/works/1",
        title: "Snow Crash",
        author_name: ["Neal Stephenson"],
        cover_i: 123,
      },
      {
        key: "/works/2",
        title: "Snowfall",
        cover_i: 456,
      },
    ];

    vi.mocked(openLibraryApi.searchBooksByTitle).mockResolvedValue(mockResults);

    const user = userEvent.setup();
    render(<BookSearch />);

    const input = screen.getByPlaceholderText(/search books by title/i);
    await user.type(input, "snow");

    const button = screen.getByRole("button", { name: /search/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Snow Crash")).toBeInTheDocument();
    });
  });

  it("should show loading state during search", async () => {
    vi.mocked(openLibraryApi.searchBooksByTitle).mockImplementation(
      () =>
        new Promise<SearchResult[]>((resolve) =>
          setTimeout(() => resolve([]), 100),
        ),
    );

    const user = userEvent.setup();
    render(<BookSearch />);

    const input = screen.getByPlaceholderText(/search books by title/i);
    await user.type(input, "test");

    const button = screen.getByRole("button", { name: /search/i });
    await user.click(button);

    expect(button).toHaveTextContent("Searching...");
  });

  it("should not search with empty query", async () => {
    render(<BookSearch />);

    const button = screen.getByRole("button", { name: /search/i });
    fireEvent.submit(button.closest("form")!);

    expect(openLibraryApi.searchBooksByTitle).not.toHaveBeenCalled();
  });

  it("should call onSearch callback when provided", async () => {
    const onSearch = vi.fn();
    vi.mocked(openLibraryApi.searchBooksByTitle).mockResolvedValue([]);

    const user = userEvent.setup();
    render(<BookSearch onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/search books by title/i);
    await user.type(input, "test query");

    const button = screen.getByRole("button", { name: /search/i });
    await user.click(button);

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith("test query");
    });
  });

  it("should recover gracefully when API returns no results", async () => {
    vi.mocked(openLibraryApi.searchBooksByTitle).mockResolvedValue([]);

    const user = userEvent.setup();
    render(<BookSearch />);

    const input = screen.getByPlaceholderText(/search books by title/i);
    await user.type(input, "test");

    const button = screen.getByRole("button", { name: /search/i });
    await user.click(button);

    // Wait for search to complete
    await waitFor(() => {
      expect(button).toHaveTextContent("Search");
      expect(screen.getByText("No books found")).toBeInTheDocument();
    });
  });
});

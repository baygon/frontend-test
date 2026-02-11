import BookCard from "./BookCard";

interface BookDisplayProps {
  isbn: string;
}

export default function BookDisplay({ isbn }: BookDisplayProps) {
  return <BookCard isbn={isbn} />;
}

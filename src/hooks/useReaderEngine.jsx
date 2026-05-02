import { useState } from "react";
import themes from "../data/data_themes";

export function useReaderEngine() {
  const [isReading, setIsReading] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(themes.default);

  const openBook = (book) => {
    setCurrentBook(book);
    setCurrentTheme(themes[book.category] || themes.default);
    setIsReading(true);
  };

  const closeBook = () => {
    setCurrentBook(null);
    setIsReading(false);
  };

  return {
    isReading,
    currentBook,
    currentTheme,
    openBook,
    closeBook,
  };
}
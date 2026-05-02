import { useState, useEffect } from "react";
import { db } from "../data_base/db.jsx";
import { notifyError, notifySuccess } from "../core/notification.jsx";
import { checkAchievement } from "../services/achievementService.jsx";

export function useLibraryEngine() {
  const [userBooks, setUserBooks] = useState([]);

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      const books = await db.books.toArray();

      const hydrated = books.map((book) => ({
        ...book,
        coverUrl:
          book.cover instanceof Blob || book.cover instanceof File
            ? URL.createObjectURL(book.cover)
            : typeof book.cover === "string"
            ? book.cover
            : null,

        fileUrl:
          book.file instanceof Blob || book.file instanceof File
            ? URL.createObjectURL(book.file)
            : typeof book.file === "string"
            ? book.file
            : null,
      }));

      setUserBooks(hydrated);
    } catch (error) {
      console.error(error);
      notifyError("Erro ao carregar livros.");
    }
  }

  async function addBook(newBook) {
    try {
      await db.books.add({
        ...newBook,
        favorite: false,
        progress: 0,
        completed: false,
        lastRead: null,
        currentPage: 1,
      });

      await loadBooks();

      await checkAchievement("first_import");
      await checkAchievement("book_collector");
      await checkAchievement("library_master");

      notifySuccess("Livro adicionado!");
    } catch (error) {
      console.error(error);
      notifyError("Erro ao adicionar livro.");
    }
  }

  async function toggleFavorite(id) {
    try {
      if (typeof id === "string") return;

      const book = await db.books.get(id);
      if (!book) return;

      await db.books.update(id, {
        favorite: !book.favorite,
      });

      await loadBooks();

      if (!book.favorite) {
        await checkAchievement("first_favorite");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteBook(id) {
    try {
      if (typeof id === "string") return;

      await db.books.delete(id);
      await loadBooks();

      notifySuccess("Livro excluído.");
    } catch (error) {
      console.error(error);
      notifyError("Erro ao excluir.");
    }
  }

  async function updateProgress(bookId, currentPage, totalPages) {
    try {
      if (typeof bookId === "string") return;

      const progress = Math.round((currentPage / totalPages) * 100);
      const completed = progress >= 100;

      await db.books.update(bookId, {
        progress,
        completed,
        lastRead: new Date().toISOString(),
        currentPage,
        totalPages,
      });

      if (completed) {
        await checkAchievement("first_finish");
        await checkAchievement("bookworm");
        await checkAchievement("reading_master");
      }

      await loadBooks();
    } catch (error) {
      console.error(error);
    }
  }

  return {
    userBooks,
    addBook,
    toggleFavorite,
    deleteBook,
    updateProgress,
    loadBooks,
  };
}
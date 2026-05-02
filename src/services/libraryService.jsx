import { db } from "../data_base/db";

export async function getAllBooks() {
  const books = await db.books.toArray();

  return books.map((book) => ({
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
}

export async function addBook(book) {
  return db.books.add({
    ...book,
    favorite: false,
    progress: 0,
    completed: false,
    currentPage: 1,
    totalPages: 0,
    lastRead: null,
  });
}

export async function deleteBook(id) {
  return db.books.delete(id);
}

export async function toggleFavorite(id) {
  const book = await db.books.get(id);
  if (!book) return;

  return db.books.update(id, {
    favorite: !book.favorite,
  });
}

export async function updateBookProgress(id, currentPage, totalPages) {
  const progress = Math.round((currentPage / totalPages) * 100);
  const completed = progress >= 100;

  return db.books.update(id, {
    progress,
    completed,
    currentPage,
    totalPages,
    lastRead: new Date().toISOString(),
  });
}
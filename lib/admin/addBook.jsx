import api from "../api";

export async function addBookApi(bookData) {
  const {
    title,
    description,
    total_copies,
    pages,
    publication_year,
    isbn,
    author_id,
    category_id,
  } = bookData;

  const res = await api.post(
    `/dashboard/books/`,
    {
      title,
      description,
      total_copies,
      pages,
      publication_year,
      isbn,
      author_id,
      category_id,
    },
    {
      withAuth: true,
    }
  );

  return res.data;
}

import api from "../api";

export async function editBookApi(bookData) {
  const {
    id,
    title,
    description,
    author_id,
    category_id,
    total_copies,
    pages,
    publication_year,
    isbn,
  } = bookData;

  const res = await api.patch(
    `/dashboard/books/${id}/`,
    {
      title,
      description,
      author_id,
      category_id,
      total_copies,
      pages,
      publication_year,
      isbn,
    },
    {
      withAuth: true,
    }
  );

  return res.data;
}

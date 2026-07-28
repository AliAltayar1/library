import api from "../api";

/**
 * Exports books as an Excel file, optionally filtered by author / category.
 * Triggers a browser download automatically.
 *
 * @param {{ author?: string, category?: string }} filters
 */
export async function exportBooks(filters = {}) {
  const params = {};
  if (filters.author) params.author = filters.author;
  if (filters.category) params.category = filters.category;

  const res = await api.get("/dashboard/books/export/", {
    withAuth: true,
    params,
    responseType: "blob",
  });

  // Build a filename that reflects the applied filters
  const parts = ["books"];
  if (filters.author) parts.push(`author-${filters.author}`);
  if (filters.category) parts.push(`category-${filters.category}`);
  const filename = parts.join("_") + ".xlsx";

  // Trigger browser download
  const url = URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

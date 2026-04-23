import api from "./api";

export const getPublishedBlogs = async () => (await api.get("/blog/public")).data;

export const getPublishedBlogBySlug = async (slug) =>
  (await api.get(`/blog/public/${encodeURIComponent(slug)}`)).data;

export const getAllBlogsAdmin = async () => (await api.get("/blog/admin")).data;

export const createBlog = async (formData) => {
  const res = await api.post("/blog/admin", formData);
  return res.data;
};

export const updateBlog = async (id, formData) => {
  const res = await api.patch(`/blog/admin/${id}`, formData);
  return res.data;
};

export const deleteBlog = async (id) => (await api.delete(`/blog/admin/${id}`)).data;

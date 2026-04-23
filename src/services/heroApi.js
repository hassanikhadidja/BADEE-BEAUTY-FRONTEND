import api from "./api";

/** Public + admin read — grouped by layout */
export const getHeroSlides = async () => (await api.get("/hero")).data;

export const createHeroSlide = async (formData) => {
  const res = await api.post("/hero", formData);
  return res.data;
};

export const updateHeroSlide = async (id, formData) => {
  const res = await api.patch(`/hero/${id}`, formData);
  return res.data;
};

export const deleteHeroSlide = async (id) => (await api.delete(`/hero/${id}`)).data;

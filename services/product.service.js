import api from "@/lib/api";

export const getProducts = async ({ page, limit, search }) => {
  const res = await api.get("/products", {
    params: {
      page,
      limit,
      search,
    },
  });
  return res.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);

  return response.data?.data;
};

export const createProduct = async (data) => {
  const response = await api.post("/products", data);

  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await api.put(`/products/${id}`, data);

  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};

import api from "@/lib/api";

export const getProducts = async (search = "") => {
  if (!search?.trim()) {
    const [categoryList, response] = await Promise.all([
      api.get("/categories/list"),
      api.get("/products"),
    ]);

    const categoryMap = new Map(
      categoryList?.data?.data?.map((c) => [c.id, c.name]) || [],
    );

    const formatResult = response?.data?.data?.map((i) => ({
      ...i,
      category_name: categoryMap.get(i?.categoryId),
    }));

    return formatResult;
  } else {
    const response = await api.get(`/products?q=${search}`);
    return response.data?.data;
  }
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
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

import api from "@/lib/api";

export const getCategories = async ({page,limit,search}) => {
  const res = await api.get("/categories",{
    params:{
      page,
      limit,
      search
    }
  });

  return res.data;
};

export const getCategoriesList = async() =>{
    const res = await api.get("/categories/list")

    return res.data
}
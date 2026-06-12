// hooks/useCurrentUser.js

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data;
    },
  });
};
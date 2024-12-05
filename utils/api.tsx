import axios from "axios";

const api = axios.create({
  baseURL: "https://fahriamura-copas.vercel.app/api",
});

export const loginAdmin = async (authKey: string) => {
    return api.post(
      "/admin/login", 
      { authKey },
      { headers: { "x-auth-key": authKey } } 
    );
  };
  

export const fetchTemplates = async (authKey: string) => {
  return api.get("/admin/templates", {
    headers: { "x-auth-key": authKey },
  });
};

export const addTemplate = async (teks: string, authKey: string) => {
  return api.post(
    "/templates",
    { teks }
  );
};

export const deleteTemplate = async (id: number, authKey: string) => {
  return api.delete(`/templates/${id}`, {
    headers: { "x-auth-key": authKey },
  });
};

export const confirmTemplate = async (id: number, authKey: string) => {
  return api.put(`/templates/${id}`, {}, { headers: { "x-auth-key": authKey } });
};

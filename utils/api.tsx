import axios, { AxiosResponse } from "axios";

// Define types for the API responses (adjust based on the expected API response structure)
interface Template {
  id: number;
  teks: string;
  status: string;
}

// Initialize Axios instance
const api = axios.create({
  baseURL: "https://fahriamura-copas.vercel.app/api",
});

// Login Admin function
export const loginAdmin = async (authKey: string): Promise<AxiosResponse> => {
  return api.post(
    "/fuehfueuehfuhefuhfu", 
    { authKey },
    { headers: { "x-auth-key": authKey } }
  );
};

// Fetch templates function
export const fetchTemplates = async (authKey: string): Promise<AxiosResponse<{ data: Template[] }>> => {
  return api.get("/admin/templates", {
    headers: { "x-auth-key": authKey },
  });
};

// Add new template function
export const addTemplate = async (teks: string, authKey: string): Promise<AxiosResponse> => {
  return api.post(
    "/templates",
    { teks },
    { headers: { "x-auth-key": authKey } }
  );
};

// Delete template function
export const deleteTemplate = async (id: number, authKey: string): Promise<AxiosResponse> => {
  return api.delete(`/templates/${id}`, {
    headers: { "x-auth-key": authKey },
  });
};

// Confirm template function
export const confirmTemplate = async (id: number, authKey: string): Promise<AxiosResponse> => {
  return api.put(`/templates/${id}`, {}, { headers: { "x-auth-key": authKey } });
};

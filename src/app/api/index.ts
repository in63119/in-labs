import { API_BASE_URL } from "@/lib/apiClient";

// Root
const authRoot = "auth";

export const endpoints = {
  auth: {
    root: authRoot,
    authentication: {
      option: `${API_BASE_URL}/${authRoot}/authentication/option`,
    },
    registration: {
      option: `${API_BASE_URL}/${authRoot}/registration/option`,
    },
  },
};

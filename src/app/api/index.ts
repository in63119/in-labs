import { API_BASE_URL } from "@/lib/apiClient";

// Root
const authRoot = "auth";
const postRoot = "posts";
const mediaRoot = "media";

export const endpoints = {
  auth: {
    root: authRoot,
    authentication: {
      option: `${API_BASE_URL}/${authRoot}/authentication/option`,
      verify: `${API_BASE_URL}/${authRoot}/authentication/verify`,
    },
    registration: {
      option: `${API_BASE_URL}/${authRoot}/registration/option`,
      verify: `${API_BASE_URL}/${authRoot}/registration/verify`,
    },
  },
  posts: {
    root: postRoot,
    publish: `${API_BASE_URL}/${postRoot}/publish`,
    delete: `${API_BASE_URL}/${postRoot}/delete`,
  },
  media: {
    root: mediaRoot,
    upload: `${API_BASE_URL}/${mediaRoot}/upload`,
  },
};

import { API_BASE_URL } from "@/lib/apiClient";

// Root
const authRoot = "auth";
const postRoot = "posts";
const mediaRoot = "media";
const visitorRoot = "visitors";

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
    passkeys: `${API_BASE_URL}/${authRoot}/passkeys`,
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
  visitors: {
    root: visitorRoot,
    check: `${API_BASE_URL}/${visitorRoot}/check`,
  },
};

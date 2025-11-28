import { API_BASE_URL } from "@/lib/apiClient";

// Root
const authRoot = "auth";
const postRoot = "posts";
const mediaRoot = "media";
const visitorRoot = "visitors";
const youtubeRoot = "youtube";
const emailRoot = "email";
const subscriberRoot = "subscriber";
const geminiRoot = "gemini";

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
    root: `${API_BASE_URL}/${visitorRoot}`,
    check: `${API_BASE_URL}/${visitorRoot}/check`,
    logs: `${API_BASE_URL}/${visitorRoot}/logs`,
  },
  youtube: {
    root: `${API_BASE_URL}/${youtubeRoot}`,
  },
  email: {
    root: `${API_BASE_URL}/${emailRoot}`,
    pin: `${API_BASE_URL}/${emailRoot}/pin`,
    pinVerify: `${API_BASE_URL}/${emailRoot}/pin/verify`,
  },
  subscriber: {
    root: `${API_BASE_URL}/${subscriberRoot}`,
    list: `${API_BASE_URL}/${subscriberRoot}/list`,
  },
  gemini: {
    root: `${API_BASE_URL}/${geminiRoot}`,
  },
};

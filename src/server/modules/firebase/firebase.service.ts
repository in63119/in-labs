import { firebase as database } from "@/common/config/firebase.config";
import type { Reference } from "firebase-admin/database";

const getRef = (path: string): Reference => {
  if (!path || typeof path !== "string") {
    throw new Error("Firebase path must be a non-empty string");
  }

  const normalizedPath = path.replace(/^\/+/, "");
  return database.ref(normalizedPath);
};

export const readFirebaseData = async <T = unknown>(
  path: string
): Promise<T | null> => {
  const snapshot = await getRef(path).get();
  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val() as T;
};

export const writeFirebaseData = async <T>(
  path: string,
  value: T
): Promise<void> => {
  await getRef(path).set(value);
};

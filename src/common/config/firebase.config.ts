import admin, { ServiceAccount } from "firebase-admin";
import getConfig from "@/common/config/default.config";
import { configReady } from "@/server/bootstrap/init";

const initializeAdminApp = async () => {
  await configReady;
  const config = getConfig();
  const firebaseConfig = config.firebase;
  if (
    !firebaseConfig ||
    !firebaseConfig.project_id ||
    !firebaseConfig.client_email ||
    !firebaseConfig.private_key ||
    !firebaseConfig.databaseURL
  ) {
    throw new Error("Firebase configuration is not loaded.");
  }

  if (admin.apps.length === 0) {
    const serviceAccount: ServiceAccount = {
      projectId: firebaseConfig.project_id,
      clientEmail: firebaseConfig.client_email,
      privateKey: firebaseConfig.private_key.replace(/\\n/g, "\n"),
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: firebaseConfig.databaseURL,
    });
  }

  return admin.app();
};

export const firebase = (await initializeAdminApp()).database();

import { initializeApp } from "firebase/app";
import getConfig from "@/common/config/default.config";
import { configReady } from "@/server/bootstrap/init";
import { getDatabase } from "firebase/database";

const app = async () => {
  await configReady;
  const config = getConfig();
  if (!config.firebase) {
    throw new Error("Firebase configuration is not loaded.");
  }

  const firebaseConfig = {
    apiKey: config.firebase.apiKey,
    authDomain: config.firebase.authDomain,
    databaseURL: config.firebase.databaseURL,
    projectId: config.firebase.projectId,
    storageBucket: config.firebase.storageBucket,
    messagingSenderId: config.firebase.messagingSenderId,
    appId: config.firebase.appId,
    measurementId: config.firebase.measurementId,
  };

  return initializeApp(firebaseConfig);
};

export const firebase = getDatabase(await app());

import { encrypt, decrypt } from "@/lib/crypto";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const secret = process.env.NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH;
if (!secret) {
  throw new Error("SECRET env is missing");
}

const [operation, value] = process.argv.slice(2);
if (!operation || !value) {
  console.error("Usage: yarn run crypto <encrypt|decrypt> <value>");
  process.exit(1);
}

const cryptoOperation = () => {
  switch (operation) {
    case "encrypt":
      console.log("Encrypted value:", encrypt(value, secret));
      break;
    case "decrypt":
      console.log("Decrypted value:", decrypt(value, secret));
      break;
    default:
      console.error("Invalid operation:", operation);
      process.exit(1);
  }
};

cryptoOperation();

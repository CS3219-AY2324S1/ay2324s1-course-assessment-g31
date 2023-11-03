import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const config = {
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY,
    clientEmail: process.env.CLIENT_EMAIL,
  }),
  databaseURL: process.env.DATABASE_URL,
};

admin.initializeApp(config);

export default admin;

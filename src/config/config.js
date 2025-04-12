import "dotenv/config";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { Admin } from "../model/index.js";

const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

sessionStore.on("error", (error) => {
  console.error("Session store error ", error);
});

export const authenticate = async (email, password) => {

  // Uncomment first time when creating admin
  // if (email && password) {
  //   if (email == "mustak@gmail.com" && password == "123456") {
  //     return Promise.resolve({ email: email, password: password });
  //   } else {
  //     return null;
  //   }
  // }

  // Uncomment when admin already created
  if (email && password) {
    const user = await Admin.findOne({ email });
    if (!user) return null;
    if (user.password === password) {
      return Promise.resolve({ email: email, password: password });
    } else {
      return null;
    }
  }

  return null;
};

import "dotenv/config";
import AdminJS from "adminjs";
import AdminJSFastify from "@adminjs/fastify";
import * as AdminJSMongoose from "@adminjs/mongoose";
import * as Model from "../model/index.js";
import { authenticate, sessionStore } from "./config.js";
import { dark, light, noSidebar } from "@adminjs/themes";

AdminJS.registerAdapter(AdminJSMongoose);

export const admin = new AdminJS({
  resources: [
    {
      resource: Model.Customer,
      options: {
        listProperties: ["phone", "role", "isActivated"],
        filterProperties: ["phone", "role"],
      },
    },
    {
      resource: Model.DeliveryPartner,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
      },
    },
    {
      resource: Model.Admin,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
      },
    },
    { resource: Model.Branch },
    { resource: Model.Product },
    { resource: Model.Category },
    { resource: Model.Order },
    { resource: Model.Counter },
  ],
  branding: {
    companyName: "Grocery App",
    withMadeWithLove: false,
  },
  defaultTheme: dark.id,
  availableThemes: [dark, light, noSidebar],
  rootPath: "/admin",
});


export const buildAdminRouter = async (app) => {
    console.log("COOKIE_PASSWORD:", process.env.COOKIE_PASSWORD);
    const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
    await AdminJSFastify.buildAuthenticatedRouter(
      admin,
      {
        authenticate,
        cookiePassword: COOKIE_PASSWORD,
        cookieName: "adminjs",
      },
      app,
      {
        store: sessionStore,
        saveUnintialized: true,
        secret: COOKIE_PASSWORD,
        cookie: {
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
        },
      }
    );
};
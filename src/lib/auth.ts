import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";
import { createAuthMiddleware, APIError } from "better-auth/api";

const mongoClient = new MongoClient(process.env.MONGODB_URI!);
const mongoDatabase = mongoClient.db("togetherly");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(mongoDatabase),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") {
        return;
      }

      const password = ctx.body?.password;

      if (typeof password !== "string" || password.length < 8) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must contain at least 8 characters.",
        });
      }

      if (!/[A-Z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must contain at least one uppercase letter.",
        });
      }

      if (!/[a-z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must contain at least one lowercase letter.",
        });
      }
    }),
  },

  plugins: [jwt()],
});
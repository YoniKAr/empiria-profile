import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_ISSUER_BASE_URL!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  secret: process.env.AUTH0_SECRET!,
  appBaseUrl: process.env.AUTH0_BASE_URL || process.env.APP_BASE_URL!,

  signInReturnToPath: "/dashboard",

  session: {
    cookie: {
      // Only set cookie domain in production — on localhost it MUST be omitted
      ...(process.env.AUTH0_COOKIE_DOMAIN && !process.env.AUTH0_BASE_URL?.includes('localhost')
        ? { domain: process.env.AUTH0_COOKIE_DOMAIN }
        : {}),
    },
  },

});

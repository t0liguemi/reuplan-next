import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.AUTH_DRIZZLE_URL,
  },
} satisfies Config;

/** @type {import("drizzle-kit").Config} */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://smart-mocker_owner:UvmlFb1gsYw7@ep-falling-rice-a5r5dfep.us-east-2.aws.neon.tech/smart-mocker?sslmode=require",
  },
};

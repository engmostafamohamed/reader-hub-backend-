import dotenv from "dotenv";

dotenv.config();

module.exports = {
  mongodb: {
    url: process.env.MONGO_URI,
    databaseName: "reader_hub_dev",
    options: {}
  },
  migrationsDir: "migrations",
  changelogCollectionName: "migrations"
};
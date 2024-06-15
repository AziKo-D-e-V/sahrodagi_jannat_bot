require("dotenv").config();
const config = {
  PORT: process.env.PORT,
  TOKEN: process.env.TOKEN,
  DB_URL: process.env.DB_URL,
  KEY: process.env.KEY,
  GROUP: {
    ID: process.env.GROUP_ID || "-1001682686838",
    USERS_THREAD_ID: process.env.USERS_THREAD_ID,
    MESSAGESS_THREAD_ID: process.env.MESSAGESS_THREAD_ID,
    ERRORS_THREAD_ID: process.env.ERRORS_THREAD_ID || 2,
    URL: "https://t.me/sahrodagi_jannat",
  },
};

module.exports = config;

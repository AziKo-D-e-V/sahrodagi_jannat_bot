const express = require("express");
const config = require("./src/config");
const { connect } = require("mongoose");
const { Bot, session } = require("grammy");
require("dotenv/config");
const BotController = require("./src/modules/bot");
const commandBot = require("./src/helper/commands");
const axios = require("axios");
const cron = require("node-cron");
const token = config.TOKEN;
const port = config.PORT;
const { hydrateReply } = require("@grammyjs/parse-mode");
const { hydrateApi, hydrateContext } = require("@grammyjs/hydrate");
const bot = new Bot(token);
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("<b>Bot is alive🎉🥳</b>");
});

app.listen(port, () => {
  console.log(`App is running and listening at http://localhost:${port}`);
});

bot.api.setMyCommands([
  {
    command: "start",
    description: "Botni qayta ishga tushirish",
  },
  {
    command: "dev",
    description: "Dasturchi",
  },
]);

bot.use(
  session({
    initial: () => ({
      step: "start",
    }),
  })
);

bot.use(hydrateReply);
bot.use(commandBot);
// bot.use(hydrateContext());
// bot.api.config.use(hydrateApi());
bot.use(BotController);

const bootstrap = async (bot) => {
  try {
    const connetParams = {};
    connect(config.DB_URL, connetParams);
    console.log("Sahrodagi jannat bot * * * * - Database connection");
  } catch (error) {
    console.log(error.message);
  }
};
bootstrap();
bot.start(console.log("Sahrodagi jannat bot started"));

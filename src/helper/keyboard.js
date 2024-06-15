const { InlineKeyboard } = require("grammy");
const config = require("../config");

const inlineKeyboard = new InlineKeyboard().url(
  "➕ Kanalga qo'shilish ➕",
  config.GROUP.URL
);

module.exports = { inlineKeyboard };

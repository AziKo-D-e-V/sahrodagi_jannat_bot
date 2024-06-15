const config = require("../config");
const { userMenu, AdminMenu } = require("../helper/keyboard");
const usersModel = require("../models/users.model");
// const orderModel = require("../models/order.model");

async function Auth(ctx, next) {
  const user = ctx.from;

  const findBotUser = await usersModel.findOne({
    user_id: user.id,
  });

  const findBotAdmin = await usersModel.findOne({
    user_id: user.id,
    is_admin: true,
  });

  if (!findBotUser) {
    await usersModel.create({
      first_name: user?.first_name,
      last_name: user?.last_name,
      username: user?.username,
      user_id: user.id,
      language_code: user.language_code,
    });

    await ctx.replyWithHTML(
      `Assalom aleykum  <b>${user?.first_name || user?.last_name}</b>👋`
    );

    let text = `#new_user\n\nFirst name: ${
      user?.first_name || ""
    }\nLast name: ${user?.last_name || ""}\nUsername: ${
      user.username ? `@${user.username}` : ""
    }\nUser ID: ${user.id}`;

    await ctx.api.sendMessage(config.GROUP.ID, text, {
      message_thread_id: config.GROUP.USERS_THREAD_ID,
    });

  } else if (findBotAdmin) {
    // ctx.reply(`Menyulardan birini tanlang`, {
    //   reply_markup: AdminMenu,
    // });
    // ctx.session.step = "adminMenu";
  }
}

async function sendMessageAndSave(ctx) {
  let message = ctx.message.text;

  // const lastOrderId = await orderModel.findOne().sort({ order_id: -1 }).exec();
  let user = await usersModel.findOne({ user_id: ctx.from.id });

  let msg = await ctx.api.sendMessage(config.GROUP.ID, text, {
    parse_mode: "HTML",
    message_thread_id: config.GROUP.MESSAGESS_THREAD_ID,
  });

  await orderModel.create({
    order_id: lastOrderId?.order_id + 1 || 1,
    order: order,
    user_id: user.id,
    post_id: msg.message_id,
    post_text: text,
  });

  ctx.reply(
    `Buyurtma bo'yicha so'rovingiz adminlarga jo'natildi. Adminlar javobini kuting...`,
    {
      reply_markup: userMenu,
    }
  );

  ctx.session.step = "menu";
}

module.exports = {
  Auth,
  sendMessageAndSave,
};

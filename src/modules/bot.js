const { Router } = require("@grammyjs/router");
const router = new Router((ctx) => ctx.session.step);
const bot = require("../helper/commands");
const { inlineKeyboard } = require("../helper/keyboard");
const { Auth } = require("../functions");
const config = require("../config");
const messageModel = require("../models/message.model");
const usersModel = require("../models/users.model");

bot.command("dev", (ctx) => {
  const a = ctx.reply("🧑‍💻Bot dasturchisi: @AziKo_dev", {
    reply_to_message_id: ctx.message.message_id,
  });
  ctx.session.step = "msg";
});

bot.command("start", async (ctx) => {
  try {
    const chatType = ctx.chat.type;

    if (chatType === "private") {
      await Auth(ctx);
      ctx.replyWithHTML(
        `<blockquote><b>Sahrodagi jannat</b> kanali uchun xabaringizni yuborishingiz mumkin😇</blockquote>\n\n<i>xabaringizni jo'nating🙃</i>`,
        {
          reply_to_message_id: ctx.message.message_id,
        }
      );
      ctx.session.step = "msg";
    } else if (chatType === "supergroup") {
      ctx.replyWithHTML(
        "<blockquote><b>Kanalga obuna bo'ling</b></blockquote>",
        {
          reply_markup: inlineKeyboard,
        }
      );
    }
  } catch (error) {
    ctx.api.sendMessage(
      config.GROUP.ID,
      "Error command 'start'\n\n" + error.message,
      {
        message_thread_id: config.GROUP.ERRORS_THREAD_ID,
      }
    );
  }
});

const msg = router.route("msg");
msg.on("message", async (ctx) => {
  const message = ctx.message.text;
  const message_id = ctx.message.message_id;
  const fromId = ctx.message.from.id;
  const forward_date = ctx.message.forward_date;

  if (ctx.message.chat.type == "private") {
    const sendVideo = await ctx.api.forwardMessage(
      config.GROUP.ID,
      fromId,
      message_id,
      {
        message_thread_id: config.GROUP.MESSAGESS_THREAD_ID,
      }
    );

    const photoFileId = ctx.message.photo ? ctx.message.photo[0].file_id : "";
    const photoFileUniqueId = ctx.message.photo
      ? ctx.message.photo[0].file_unique_id
      : "";

    const a = await messageModel.create({
      message: message || ctx.message?.caption,
      user_id: ctx.message.from.id,
      forward_date: sendVideo.forward_origin.date || forward_date,
      file_id: ctx.message.video?.file_id || photoFileId,
      file_unique_id: ctx.message.video?.file_unique_id || photoFileUniqueId,
    });

    await ctx.reply("Sizning xabaringiz qabul qilindi😊", {
      reply_to_message_id: ctx.message.message_id,
    });
    ctx.session.step = "msg";
  }
});

bot.on("message", async (ctx, next) => {
  const message = ctx.message.text;
  const message_id = ctx.message.message_id;
  const fromId = ctx.message.from.id;
  const forward_date = ctx.message.forward_date;

  if (ctx.message.chat.type === "supergroup") {
    const admin = await usersModel.findOne({
      user_id: ctx.message.from.id,
      is_admin: true,
    });

    if (admin && ctx.chat.id == config.GROUP.ID) {
      const data = ctx.message.reply_to_message?.forward_date;

      const result = await messageModel.findOne({ forward_date: data });

      const response = `👮🏻‍♂️Admin:\n\n${
        ctx.message?.text || ctx.message?.caption
      }`;

      if (ctx.message.audio) {
        await ctx.api.sendAudio(result.user_id, ctx.message.audio.file_id, {
          caption: response,
          reply_message_id: ctx.message.reply_to_message.message_id,
        });

        await ctx.reply("Xabar jo'natildi ✅✅✅", {
          message_thread_id: config.GROUP.MESSAGESS_THREAD_ID,
          reply_to_message_id: ctx.message.message_id,
        });
      } else {
        try {
          await ctx.api.sendMessage(result.user_id, response, {
            reply_to_message_id: result.message_id,
          });

          await ctx.reply("Xabar jo'natildi ✅✅✅", {
            message_thread_id: config.GROUP.MESSAGESS_THREAD_ID,
            reply_to_message_id: ctx.message.message_id,
          });
        } catch (error) {
          if (
            error.error_code === 403 ||
            error.description === "Forbidden: bot was blocked by the user"
          ) {
            await ctx.reply(
              `User botni bloklagani bois xabar jo'natilmadi. \n\n<code>${error.message}</code>`,
              {
                parse_mode: "HTML",
                message_thread_id: config.GROUP.MESSAGESS_THREAD_ID,
              }
            );
          } else {
            await ctx.reply(
              `Xabar jonatishdagi xatolik. \n\n<code>${error.message}</code>`,
              {
                parse_mode: "HTML",
                message_thread_id: config.GROUP.ERRORS_THREAD_ID,
              }
            );
          }
        }
      }
    } else if (
      admin.user_id == "5634162263" &&
      config.GROUP.ID == ctx.chat.id
    ) {
      const data = ctx.message.reply_to_message?.forward_date;

      const result = await adminMessageModel.findOne({ forward_date: data });

      const response = `👮🏻‍♂️Admin:\n\n${ctx.message.text}`;
      try {
        await ctx.api.sendMessage(result.user_id, response, {
          reply_message_id: ctx.message.reply_to_message.message_id,
        });

        await ctx.reply("Xabar jo'natildi ✅✅✅", {
          message_thread_id: config.GROUP.MESSAGESS_THREAD_ID,
        });
      } catch (error) {
        if (
          error.error_code === 403 ||
          error.description === "Forbidden: bot was blocked by the user"
        ) {
          await ctx.reply(
            `Admin botni bloklagani bois xabar jo'natilmadi. \n\n<code>${error.message}</code>`,
            {
              parse_mode: "HTML",
              message_thread_id: config.GROUP.MESSAGESS_THREAD_ID,
            }
          );
        } else {
          await ctx.reply(
            `Xabar jonatishdagi xatolik. \n\n<code>${error.message}</code>`,
            {
              parse_mode: "HTML",
              message_thread_id: config.ERROR_THREAD_ID,
            }
          );
        }
      }
    }
  } else if (ctx.message.chat.type === "private") {
    const sendVideo = await ctx.api.forwardMessage(
      config.GROUP.ID,
      fromId,
      message_id,
      {
        message_thread_id: config.GROUP.MESSAGESS_THREAD_ID,
      }
    );

    const photoFileId = ctx.message.photo ? ctx.message.photo[0].file_id : "";
    const photoFileUniqueId = ctx.message.photo
      ? ctx.message.photo[0].file_unique_id
      : "";

    const a = await messageModel.create({
      message: message || ctx.message?.caption,
      message_id: ctx.message.message_id,
      user_id: ctx.message.from.id,
      forward_date: sendVideo.forward_origin.date || forward_date,
      file_id: ctx.message.video?.file_id || photoFileId,
      file_unique_id: ctx.message.video?.file_unique_id || photoFileUniqueId,
    });

    await ctx.reply("Sizning xabaringiz qabul qilindi😊", {
      reply_to_message_id: ctx.message.message_id,
    });
    ctx.session.step = "msg";
  }
});

module.exports = router;

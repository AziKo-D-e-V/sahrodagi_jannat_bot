const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
    },
    message_id: {
      type: Number,
    },
    forward_date: {
      type: Number,
      required: true,
    },
    file_id: {
      type: String,
    },
    file_unique_id: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("messages", messageSchema);

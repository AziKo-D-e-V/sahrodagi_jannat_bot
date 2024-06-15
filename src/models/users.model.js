const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: "String",
    },
    last_name: {
      type: "String",
    },
    username: {
      type: "String",
    },
    user_id: {
      type: Number,
      required: true,
    },
    is_admin: {
      default: false,
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);

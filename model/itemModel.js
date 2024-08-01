const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "Text",
      "Image",
      "Video",
      "GIF",
      "TextInput",
      "NumberInput",
      "EmailInput",
      "PhoneInput",
      "DateInput",
      "RatingInput",
      "ButtonInput",
    ],
  },
  name: {
    type: String,
    required: true,
  },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
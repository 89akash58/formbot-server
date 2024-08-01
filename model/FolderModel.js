const mongoose = require("mongoose");
const folderSchema = new mongoose.Schema({
  foldername: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  forms: [{ type: String }],
});

const Folder = mongoose.model("Folder", folderSchema);
module.exports = Folder;

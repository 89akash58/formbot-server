const Item = require("../model/itemModel");

const createform = async (req, res) => {
  try {
    const { items } = req.body; // Expecting an array of items
    console.log(items);
    if (!Array.isArray(items)) {
      //   console.log("item not in array");
      return res.status(400).json({ error: "Invalid data format" });
    }

    const savedItems = await Item.insertMany(items);
    // res.status(201).json(savedItems);
    res.status(200).json({ message: "item created successfully", savedItems });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getitem = async (req, res) => {
  try {
    const items = await Item.find(); // Retrieve all items from the database
    res.status(200).json(items);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = { createform, getitem };

const { Schema, model } = require("mongoose");

const findSchema = new Schema({
  name: String,
});

const Find = model("Find", findSchema);

module.exports = Find;
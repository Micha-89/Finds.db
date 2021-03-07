const { Schema, model } = require("mongoose");

const findSchema = new Schema({
  objectType: String,
  age: {
    type: String,
    enum: ['uncertain', 'stone age', 'bronze age', 'iron age', 'roman', 'early medieval', 'medieval', 'post medieval', 'modern'],
    default: 'uncertain'
  },
  description: String,
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  },
  hunt: {
    type: Schema.Types.ObjectId,
    ref: 'Hunt'
  }
});

const Find = model("Find", findSchema);

module.exports = Find;
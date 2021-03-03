const { Schema, model } = require("mongoose");

const locationSchema = new Schema({
  name: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  hunts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Hunt'
    }
  ]
});

const Location = model("Location", locationSchema);

module.exports = Location;
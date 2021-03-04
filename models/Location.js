const { Schema, model } = require("mongoose");

const locationSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  longitude: Number,
  latitude: Number,
  hunts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Hunt'
    }
  ],
});

const Location = model("Location", locationSchema);

module.exports = Location;
const { Schema, model } = require("mongoose");

const locationSchema = new Schema({
  name: String,
  sessions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Session'
    }
  ]
});

const Location = model("Location", locationSchema);

module.exports = Location;
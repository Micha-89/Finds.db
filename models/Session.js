const { Schema, model } = require("mongoose");

const sessionSchema = new Schema({
  name: String,
  finds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Find'
    }
  ]
});

const Session = model("Session", sessionSchema);

module.exports = Session;
const { Schema, model } = require("mongoose");

const huntSchema = new Schema({
  date: String,
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  },
  finds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Find'
    }
  ]
});

const Hunt = model("Hunt", huntSchema);

module.exports = Hunt;
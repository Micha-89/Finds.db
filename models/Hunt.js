const { Schema, model } = require("mongoose");

const huntSchema = new Schema({
  name: String,
  finds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Find'
    }
  ]
});

const Hunt = model("Hunts", huntSchema);

module.exports = Hunt;
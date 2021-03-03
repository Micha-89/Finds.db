const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true
    },
    password: String,
    locations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Location'
      }
    ]
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;

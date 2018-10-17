var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

var UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    maxlength: [20, "username should be less than or equal to 20 characters"],
    match: /^[a-zA-Z0-9_]*$/ // allow usernames with lowercase, uppercase, numbers, and underscore
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[^\s@]+@[^\s@]+\.[^\s@]+/ // check for valid emails
  }
}, { timestamps: true });

UserSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, function (error, salt) {
    if (error) {
      return next(error);
    }
    bcrypt.hash(user.get("password"), salt, function (error, hash) {
      if (error) {
        return next(error);
      }

      user.set("password", hash);
      next();
    });
  });
});

// validate user's password during login
UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
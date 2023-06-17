const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{ type:String, required:true, unique:true },
    email:{ type:String, required:true, unique:true },
    password:{ type:String, required:true },
    isAdmin: {type: Boolean, default: false},
    token: { type: String },
    profilepic:{ type:String, default:"" },
},
{
    timestamps:true
}
);

module.exports = mongoose.model("users", userSchema);
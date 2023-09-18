const mongoose = require("mongoose");

const PrivateRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    data: {
        type: String,
        default: "Paste your content here"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("privateRoom", PrivateRoomSchema);
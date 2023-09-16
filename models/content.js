const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
    data: {
        type: String,
        default: "Type here..."
    }
},{
    timestamps : true
})

module.exports = mongoose.model("content", ContentSchema);
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const content = require("./models/content.js");
const dotenv = require('dotenv');
dotenv.config();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connected with database");
}).catch((err) => {
    console.log(err);
})

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
    try {
        const contentData = await content.find({});
        console.log(contentData[0].data);
        res.render("index", { data: contentData[0].data ? contentData[0].data : "Made by Sohan" });
    } catch (error) {
        if (error) console.log(error);
    }
})

app.post("/save", async (req, res) => {
    try {
        const { data } = req.body;
        console.log(data.trim());
        const contentData = await content.find({});
        if (contentData.length == 0) {
            const newContent = new content({
                data: data.trim()
            })
            await newContent.save();
        }
        else {
            const id = contentData[0]._id;
            // console.log(id);
            const updatedContent = await content.findByIdAndUpdate({
                _id: id
            }, {
                "data": data.trim()
            })
            // console.log(updatedContent);
        }
        return res.json({ msg: "Data saved successfully" });
    } catch (error) {
        if (error) console.log(error);
    }
})

const PORT = process.env.PORT;
app.listen(PORT, (error) => {
    if (error) console.log(error);
    else console.log("server is running on PORT: " + PORT);
})
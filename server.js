const express = require('express');
const app = express();
const mongoose = require("mongoose");
const content = require("./models/content.js");
const privateRoom = require("./models/privateRoom.js");
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
        // console.log(contentData[0].data);
        res.render("index", { data: contentData[0].data ? contentData[0].data : "Made by Sohan" });
    } catch (error) {
        if (error) console.log(error);
    }
})

app.post("/save", async (req, res) => {
    try {
        const { data } = req.body;
        // console.log(data.trim());
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

app.post("/create-private-room", async (req, res) => {
    try {
        const { name, password } = req.body;
        // console.log(name, password);
        if (!name || !password)
            return res.json({ msg: "Enter all the fields", code: 300 });

        const room = await privateRoom.find({ name: name });
        // console.log(room);
        if (room.length == 1)
            return res.json({ msg: "Room name is already taken", code: 300 });

        const newRoom = new privateRoom({
            name: name,
            password: password
        });
        await newRoom.save();
        return res.json({ msg: "Room created successfully", room: newRoom, code: 200 });
    } catch (error) {
        if (error) console.log(error);
    }
})

app.get("/private-room/:id", async (req, res) => {
    try {
        const room = await privateRoom.find({
            _id: req.params.id
        })
        // console.log(room);
        res.render("privateRoom", { room: room[0] });
    } catch (error) {
        if (error) console.log(error);
    }
})

app.post("/join-private-room", async (req, res) => {
    try {
        const { roomId, password } = req.body;
        if (!roomId || !password)
            return res.json({ msg: "Enter all the fields", code: 300 });

        // console.log(roomId, password);
        if (mongoose.Types.ObjectId.isValid(roomId)) {
            const room = await privateRoom.find({
                "_id": new mongoose.Types.ObjectId(roomId)
            })
            // if (room.length == 0)
            //     return res.json({ msg: "Invalid room id", code: 300 });

            const roomPass = room[0].password;
            if (password != roomPass)
                return res.json({ msg: "Password is incorrect", code: 300 });

            return res.json({ msg: "Room authentication successful", room: room[0], code: 200 });
        }
        else {
            return res.json({ msg: "Invalid room id", code: 300 });
        }
        
    } catch (error) {
        if (error) console.log(error);
    }
})

app.post("/save-private", async (req, res) => {
    try {
        const { roomId, data } = req.body;
        // const room = await privateRoom.find({
        //     _id: roomId
        // })
        // console.log(room);
        const updatedRoom = await privateRoom.findByIdAndUpdate({
            _id: roomId
        }, {
            data: data.trim()
        })
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
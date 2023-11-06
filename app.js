import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {useNewUrlParser : true});

const postScheme = mongoose.Schema({
    userName: String,
    title: String,
    content: String,
    date: String

});

const Post = mongoose.model("post", postScheme);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

let postsArray = [];

app.get("/", async(req, res) => {
    postsArray = await Post.find();
    const reversed = postsArray.reverse();
    res.render("blog.ejs", {
        posts: reversed
    });
});

app.get("/about-us", (req, res) => {
    res.render("aboutUs.ejs");
});

app.get("/contact-us", (req, res) => {
    res.render("contactUs.ejs");
});

app.get("/createPost", (req, res) => {
    res.render("compose.ejs");
});

app.post("/post", async(req, res) => {
    // get the date
    const today = new Date();
    const month = today.getMonth() + 1; // Months are zero-indexed in JavaScript
    const day = today.getDate();
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    // get the time
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const formattedTime = `${hours}:${minutes}`;
    // get the date and time together 
    const dateAndTime = formattedDate + '\n' + formattedTime;

    const submitName = req.body.name;
    const newPost = new Post({
        userName: submitName,
        title: req.body.title,
        content: req.body.content,
        date: dateAndTime
    });
    newPost.save();
    
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
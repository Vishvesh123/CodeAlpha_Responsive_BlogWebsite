//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Welcome to our website! We are thrilled to have you here. Whether you're seeking information, inspiration, or assistance, you've come to the right place. Our platform is dedicated to providing a seamless and enriching experience for all visitors. From expert advice and helpful resources to engaging discussions and thought-provoking content, we aim to cater to your needs and interests. Explore our vast array of topics, ranging from technology and science to art and culture, as we strive to offer a well-rounded and diverse selection of information. Join our vibrant community of enthusiasts, learners, and curious minds, and embark on a journey of discovery. Together, let's delve into the depths of knowledge and unlock the wonders that await us.";
const aboutContent = "Welcome to our About page! Here, we would like to share our story and vision with you. Our journey began with a passion for knowledge and a deep appreciation for the power of information. We believe that everyone deserves access to reliable, accurate, and engaging content that can enrich their lives. Our team of dedicated experts and enthusiasts work tirelessly to curate and create content that educates, entertains, and inspires. We strive to foster a sense of community and foster meaningful connections among our users, encouraging dialogue, collaboration, and the sharing of ideas. Our commitment to excellence drives us to continuously improve and innovate, ensuring that our platform remains a trusted source of information and a hub for intellectual growth. Join us on this exciting adventure as we continue to explore the vast realms of knowledge and ignite the spark of curiosity within each and every one of us. Together, let's embark on a journey of discovery, learning, and personal growth.";
const contactContent = "Thank you for visiting our Contact page. We value your feedback, questions, and suggestions, and we're here to assist you in any way we can. Whether you have a general inquiry, a technical issue, or simply want to reach out, we encourage you to get in touch with us. You can use the contact form below to send us a message, and we will respond to you as soon as possible. Alternatively, you can find our contact information listed below, including our email address and phone number, should you prefer to reach out to us directly. We appreciate your interest in connecting with us, and we look forward to hearing from you. Your input is invaluable to us as we strive to enhance our services and create an even better user experience. Thank you for your support, and we hope to engage with you soon!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



const uri = 'mongodb://localhost:27017/blogDB';


const options = {
useNewUrlParser: true,
useUnifiedTopology: true,
serverSelectionTimeoutMS: 5000,
autoIndex: false, // Don't build indexes
maxPoolSize: 10, // Maintain up to 10 socket connections
serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
family: 4 // Use IPv4, skip trying IPv6
}

mongoose.connect(uri,options);

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

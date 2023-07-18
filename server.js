const express = require('express');
const mongoose = require('mongoose');
const Note = require('./modal/note');
const router = require("express").Router();
const User = require("./modal/user");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());

mongoose.connect("mongodb+srv://Cluster71972:patu2772@cluster71972.odih9tz.mongodb.net/Notes",{useNewUrlParser:true}, {useUnifiedTopology:true}, ()=>{
    console.log("connected to mongodb");
});
//User 
//Login
app.post("/",async (req,res)=>{
    const {email,password} = req.body;
    try {
        const check = await User.findOne({email:email});
        if(check){
            const pass = await User.findOne({password:password});
            if(pass){
                res.json("Valid");
            }else{
                res.json("Wrong Password");
            }
        }else{
            res.send("Register");
        }
    } catch (error) {
        res.json("Not exist");
    }
});
//register
app.post("/register",async (req,res)=>{
    const {username,email,password} = req.body;
    const newUser = {
        username: username,
        email: email,
        password: password
    };
    try {
        const check = await User.findOne({email:email});
        if(check){
            res.json("Already Exist!");
        }else{
            User.insertMany(newUser);
            // res.redirect("/home");
            res.send("Registered");
        }
    } catch (error) {
        res.json("Already Exist!");
    }
});
//get user Notes
app.get("/home/:email",async (req,res)=>{
    try {
        const username = await User.findOne({email:req.params.email});
        const userNotes = await Note.find({userId:username._id});
        res.status(200).json(userNotes);
    } catch (error) {
        res.json(error);
    }
});
//Add new Note to user
app.post("/home/:email",async (req,res)=>{
    const {title,content} = req.body;
    const user = await User.findOne({email:req.params.email});
    const newNote = {
        userId: user._id,
        title: title,
        content: content
    };
    const note = new Note(newNote);
    try {
        const savedNote = await note.save();
        res.status(200).json(savedNote);
    } catch (error) {
        res.status(500).json(error);
    }
});

//delete Note
app.delete("/home/:email/:id",async(req,res)=>{
    try {
        const user = await User.findOne({email:req.params.email});
        const note = await Note.findById(req.params.id);
        console.log(note);
        console.log(note.userId+" "+user.id);
        if(note.userId===user.id){
            await note.deleteOne();
            res.status(200).json("The note has been deleted");
        }else{
            res.status(400).json("Can't delete note");
        }
    } catch (error) {
        res.status(400).json(error);
    }
});

app.listen(3001,()=>{
    console.log("Server running on port 3001")
});
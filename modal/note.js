const mongoose = require('mongoose');

const notesSchema = mongoose.Schema({
    userId:{
        type:String,
        require:true
    },
    title:{
        type:String,
        require:true,
        max:50
    },
    content:{
        type:String,
        require:true
    }
},{timestamps:true});

module.exports = mongoose.model("Note",notesSchema);
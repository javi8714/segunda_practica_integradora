import mongoose from 'mongoose';

const chatcollection = "chatMessages";

const schema = new mongoose.Schema({
    user: String,
    message: String
});

export const chatModel = mongoose.model(chatcollection,schema)

import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/db.js';

dotenv.config();

const app = express();

connectDB();

const PORT = process.env.PORT||3000;

app.listen(PORT, ()=>{
    console.log("listening to port 3000");
});
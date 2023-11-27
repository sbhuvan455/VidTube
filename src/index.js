import dotenv from 'dotenv';
import { connectDB } from './db/db.js';
import { app } from './app.js';

dotenv.config();
const PORT = process.env.PORT || 8000;

connectDB()
.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Listening on port ${PORT}`);
    })
    app.on('error',(err)=>console.log(`Connected to Database, but server not listening ${err.message}`));
})
.catch((error)=>{
    console.log("ERROR CONNECTING TO DATABASE: " + error.message);
})

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { authRouter } from "./routers/auth";
import { contentRouter } from "./routers/content";
import { contentShareRouter } from "./routers/contentShare";
import { DB_NAME, DB_PASS, PORT } from "./config";
import cors, { CorsOptions } from "cors";




const app = express();
const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/v1/', authRouter);
app.use('/api/v1/', contentRouter);
app.use('/api/v1/', contentShareRouter);

app.listen(PORT, async () => {
    await mongoose.connect(`mongodb+srv://${DB_NAME}:${DB_PASS}@cluster0.a1mif.mongodb.net/Brainly?retryWrites=true&w=majority&appName=Cluster0`);

    console.log(`running on port : ${PORT}`);
}); 
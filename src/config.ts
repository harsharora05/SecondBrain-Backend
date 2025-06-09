import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET!;
const DB_NAME = process.env.DB_USERNAME!;
const DB_PASS = process.env.DB_PASSWORD!;
const JWT_ID_SECRET = process.env.JWT_ID_SECRET!;
const PORT = process.env.PORT!;
const SHARED_URL = process.env.SHARED_URL!;


export { SECRET, DB_NAME, DB_PASS, PORT, JWT_ID_SECRET, SHARED_URL };



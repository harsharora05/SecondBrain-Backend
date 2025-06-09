import { Request } from "express";
import mongoose from "mongoose";

interface myRequest extends Request {
    userId?: mongoose.Types.ObjectId
}

export { myRequest };
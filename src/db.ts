import mongoose, { Schema, model } from "mongoose";



const userSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String },
});


const tagSchema = new Schema({
    tag: { type: String, unique: true }
});

const Types = ["document", "tweet", "youtube"];

const contentSchema = new Schema({
    type: { type: String, enum: Types },
    title: { type: String, required: true },
    content: { type: String },
    tags: [{ type: mongoose.Types.ObjectId, ref: "tags" }],
    contentBy: { type: mongoose.Types.ObjectId, ref: "users" },
    canShared: { type: Boolean, default: false },
    shareLink: { type: String }
}, { timestamps: true });


const userModel = model("users", userSchema);
const tagModel = model("tags", tagSchema);
const contentModel = model("contents", contentSchema);

export { userModel, tagModel, contentModel }





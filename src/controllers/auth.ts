import { Response, Request } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET } from "../config";




import { userModel } from "../db";



const register = async (req: Request, res: Response) => {
    const userObject = z.object({
        username: z.string().min(3, "Minimum Length should be 3").max(10, "Maximum Length should be 10"),
        password: z.string().min(8, "Minimum Length should be 8").max(20, "Maximum Length should be 20").regex(/.*[A-Z].*/, "Should have atleast 1 Uppercase Letter").regex(/.*[a-z].*/, "Should have atleast 1 Lowercase Letter").regex(/.*[0-9].*/, "Should have atleast 1 Number").regex(/.*[@#$%^&*].*/, "Should have atleast 1 special Character"),
        confirmPassword: z.string()

    }).strict().refine((data) => data.confirmPassword === data.password, {
        message: "Passwords don't Match",
        path: ["confirmPassword"]
    });

    try {
        const userValidation = userObject.safeParse(req.body);

        if (!userValidation.success) {
            res.status(411).json({
                "message": userValidation.error.errors.map((er) => er.message)
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(userValidation.data.password, 5);

        const existingUser = await userModel.findOne({ username: userValidation.data.username });
        if (existingUser) {
            res.status(400).json({ "message": "User Already Exists" });
            return;
        }


        const user = await userModel.create({
            username: userValidation.data.username,
            password: hashedPassword,
        });

        if (user) {
            res.status(200).json({ "message": "Successfully Registered" });
            return;
        } else {
            res.status(400).json({ "message": "Not Successfully Registered" });
            return;
        }

    } catch (e) {

        res.status(500).json({ "message": "Server Error" });

    }

}

const login = async (req: Request, res: Response) => {
    const userObject = z.object({
        username: z.string(),
        password: z.string()
    })

    try {


        const userValidation = userObject.safeParse(req.body);

        if (!userValidation.success) {
            res.status(400).json({ "message": "Invalid Credentials" })
            return;
        }

        const user = await userModel.findOne({ username: userValidation.data.username });

        if (!user) {
            res.status(400).json({ "message": "Invalid Credentials" });
            return;
        } else {
            const passwordValidation = await bcrypt.compare(userValidation.data.password, user.password!);
            if (!passwordValidation) {
                res.status(400).json({ "message": "Invalid Credentials" });
                return;
            }

            const token = jwt.sign({ username: userValidation.data.username }, SECRET, { expiresIn: '1d' });
            res.status(200).json({ "token": token, "message": "Login Successfull", "username": userValidation.data.username });

        }


    } catch (e) {
        res.status(500).json({ "message": "Server Error" });
    }



}


export { register, login }
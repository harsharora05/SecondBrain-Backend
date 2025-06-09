import { Request, Response, NextFunction } from "express";
import { userModel } from "../db";
import jwt, { JwtPayload } from "jsonwebtoken";


import { SECRET } from "../config";
import { myRequest } from "../types/myRequest";



const isAuthenticated = async (req: myRequest, res: Response, next: NextFunction) => {


    const token = req.headers.authorization;

    if (!token) {
        res.status(400).json({
            "message": "Token Not Found"
        });

        return;
    }

    try {

        const tokenData = jwt.verify(token, SECRET) as JwtPayload;

        if (tokenData) {
            const user = await userModel.findOne({ username: tokenData.username });
            if (!user) {
                res.status(403).json({
                    "message": "User Not Found"
                });

                return;
            } else {

                req.userId = user._id;
                next();
            }


        } else {
            res.status(400).json({
                "message": "Invalid Token"
            });
            return;
        }

    } catch (e) {
        res.status(500).json({
            "message": "Server Error"
        });

    }

};


export { isAuthenticated }
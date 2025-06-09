import { Response, Request, Router } from "express";
import { login, register } from "../controllers/auth";


const authRouter = Router();




authRouter.post("/signUp", register)
authRouter.post("/signIn", login)


export { authRouter };




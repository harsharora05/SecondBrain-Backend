import { Router } from "express";
import { contentAdd, contentDelete, contentFetch, contentTypeFetch } from "../controllers/content";
import { isAuthenticated } from "../middlewares/authMiddleware";


const contentRouter = Router();



contentRouter.get("/content", isAuthenticated, contentFetch)
contentRouter.get("/content-type/:type", isAuthenticated, contentTypeFetch)
contentRouter.post("/content", isAuthenticated, contentAdd)
contentRouter.delete("/content/:contentId", isAuthenticated, contentDelete)


export { contentRouter };
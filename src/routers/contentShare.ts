import { Router } from "express";
import { enableShare, getContent, disableShare } from "../controllers/contentShare";
import { isAuthenticated } from "../middlewares/authMiddleware";

const contentShareRouter = Router();


contentShareRouter.post("/e-share/:contentId", isAuthenticated, enableShare)
contentShareRouter.post("/d-share/:contentId", isAuthenticated, disableShare)

contentShareRouter.get("/content/:shareId", getContent)


export { contentShareRouter };

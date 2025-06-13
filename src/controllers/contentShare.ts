import { JWT_ID_SECRET, SHARED_URL } from "../config";
import { contentModel } from "../db";
import { myRequest } from "../types/myRequest";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const enableShare = async (req: myRequest, res: Response) => {

    const contentId = req.params.contentId;
    const userId = req.userId;

    try {
        const sharedId = jwt.sign({ "contentId": contentId }, JWT_ID_SECRET);
        const updateContent = await contentModel.updateOne({ contentBy: userId, _id: contentId }, { $set: { canShared: true, shareLink: `${SHARED_URL}/${sharedId}` } });
        const UpdatedContent = await contentModel.findOne({ contentBy: userId, _id: contentId });

        if (updateContent) {
            if (UpdatedContent) {
                res.status(200).json({ "message": "Now You Can share Your Post", "link": `${UpdatedContent.shareLink}` });
            }
        } else {
            res.status(400).json({ "message": "Can't make it shareable right now. Try Again Later" })
        }

    } catch (e) {

        res.status(500).json({ "message": "Server Error" })

    }

};

const getContent = async (req: Request, res: Response) => {
    const shareId = req.params.shareId;
    try {
        const decodedData = jwt.verify(shareId, JWT_ID_SECRET) as JwtPayload;

        const content = await contentModel.findOne({ _id: decodedData.contentId, canShared: true }).populate({ path: "tags", select: "tag" }).populate({ path: "contentBy", select: "username" }).select({
            "canShared": 0
        });

        if (content) {
            if (content.shareLink === `${SHARED_URL}/${shareId}`) {
                console.log(`${SHARED_URL}/${shareId}`);

                res.status(200).json({ "content": content });
            } else {
                res.status(400).json({ "message": "Link expired" });
            }
        } else {
            res.status(400).json({ "message": "Link might got disabled...Check with owner" });
        }
    } catch (e) {
        console.log(e);

        res.status(500).json({ "message": "Server Error" });
    }
};
const disableShare = async (req: myRequest, res: Response) => {


    const contentId = req.params.contentId;
    const userId = req.userId;

    try {

        const updateContent = await contentModel.findOneAndUpdate({ contentBy: userId, _id: contentId }, { $set: { canShared: false, shareLink: `` } });

        if (updateContent) {
            res.status(200).json({ "message": "Disabled Shareing Sucessfully" })
        } else {
            res.status(400).json({ "message": "Error Occurred. Try Again Later" })
        }

    } catch (e) {

        res.status(500).json({ "message": "Server Error" })

    }


};






export { enableShare, getContent, disableShare }

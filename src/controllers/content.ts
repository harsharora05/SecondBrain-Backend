import { Request, Response } from "express";
import { myRequest } from "../types/myRequest";
import { z } from "zod";
import { contentModel, tagModel } from "../db";




const contentAdd = async (req: myRequest, res: Response) => {
    const contentSchema = z.object({
        type: z.string(),
        content: z.string(),
        title: z.string().min(3, "Minimum Length Should be 3"),
        tags: z.array(z.string()).min(1, "Must Have Atleast 1 Tag").max(5, "Atmost 5 Tags Are Allowed")
    });
    try {
        const contentValidation = contentSchema.safeParse(req.body);

        if (!contentValidation.success) {
            res.status(400).json({ "message": contentValidation.error.errors.map(er => er.message) });
            return;
        }



        const contentOp = await contentModel.create({
            type: contentValidation.data.type,
            content: contentValidation.data.content,
            title: contentValidation.data.title,
            contentBy: req.userId
        });


        const createdTags = await Promise.all(

            contentValidation.data.tags.map(async (tag) => {
                const tagData = await tagModel.findOneAndUpdate({ tag }, { tag }, { upsert: true, new: true, setDefaultsOnInsert: true });
                return tagData;
            })
        );

        const tagIds = createdTags.map(tag => tag._id);

        await contentModel.findByIdAndUpdate({ _id: contentOp._id }, { $push: { tags: { $each: tagIds } } });

        const finalContent = await contentModel.find({ _id: contentOp._id }).populate({ path: 'tags', select: 'tag' }).populate({ path: 'contentBy', select: 'username' });

        res.status(200).json({ "message": "Content Added", "content": finalContent });



    } catch (e: any) {

        if (e.code === 11000) {
            res.status(403).json({ "message": "Content with same title exists" });
        }
        else {
            res.status(500).json({ "message": "Server Error" });
        }




    }



};
const contentFetch = async (req: myRequest, res: Response) => {

    try {
        const userId = req.userId;

        const fullContent = await contentModel.find({ contentBy: userId }).populate({ path: 'tags', select: 'tag' });

        if (fullContent) {
            res.status(200).json({ "content": fullContent });
        }
    } catch (e) {
        res.status(500).json({ "message": "Sever Error" });
    }

};
const contentDelete = async (req: myRequest, res: Response) => {

    const contentId = req.params.contentId;
    const userId = req.userId

    try {

        const contentDelete = await contentModel.findOneAndDelete({ _id: contentId, contentBy: userId });

        if (contentDelete) {
            res.status(200).json({ "messaga": "Deleted Sucessfully" });
        } else {
            res.status(400).json({ "messaga": "Content Not Found" });
        }


    } catch (e) {

        res.status(500).json({ "message": "Server Error" });


    }
};

const contentTypeFetch = async (req: myRequest, res: Response) => {


    try {

        const type = req.params.type;
        const userId = req.userId;

        const data = await contentModel.find({ contentBy: userId, type: type }).populate({ path: "tags", select: "tag" })

        res.status(200).json({ "content": data })

    } catch (e) {
        console.log(e);

        res.status(500).json({ "message": "Server Error" });
    }

}


export { contentAdd, contentFetch, contentDelete, contentTypeFetch }

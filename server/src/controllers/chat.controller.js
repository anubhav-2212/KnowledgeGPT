import { ragQuery } from "../services/rag.service.js";
import { KnowledgeBase } from "../models/KnowledgeBase.models.js";

export const chat = async(req,res)=>{

    try {
        const {knowledgeBaseId,question} = req.body;

        //validate req
        if(!knowledgeBaseId){
            throw new Error("Knowledge base id is required");
        }
        if(!question.trim()){
            throw new Error("Question is required");
        }

        const knowledgeBase=await KnowledgeBase.findOne({
          _id:knowledgeBaseId,userId:req.user.id});
        if (!knowledgeBase) {
            throw new Error("Knowledge base not found");
        }
        const {answer,results}=await ragQuery(question,knowledgeBase._id);
        res.status(200).json({answer,results});
        
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}
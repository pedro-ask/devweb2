import { Request, Response } from "express";
import CommentDataBaseService from "../services/CommentDataBaseService";

class CommentController {
  async listComments(req: Request, res: Response) {
    try {
      const comments = await CommentDataBaseService.listDBComments();
      res.json({
        status: "ok",
        comments,
      });
    } catch (error: any) {
      res.json({
        status: "error",
        message: error.message,
      });
    }
  }

  async createComment(req: Request, res: Response) {
    const { content, postId, authorId } = req.body;

    if (!content || !postId || !authorId) {
      res.json({
        status: "error",
        message: "Faltam parâmetros",
      });
      return;
    }

    try {
      const newComment = await CommentDataBaseService.insertDBComment({
        content,
        post: { connect: { id: postId } },
        author: { connect: { id: authorId } },
      });
      res.json({
        status: "ok",
        newComment,
      });
    } catch (error: any) {
      res.json({
        status: "error",
        message: error.message,
      });
    }
  }

  async updateComment(req: Request, res: Response) {
    const id = req.params.id;
    const { content, postId, authorId } = req.body;

    if (!id || !content || !postId || !authorId) {
      res.json({
        status: "error",
        message: "Faltam parâmetros",
      });
      return;
    }

    try {
      const updatedComment = await CommentDataBaseService.updateDBComment(
        {
          content,
          post: { connect: { id: postId } },
          author: { connect: { id: authorId } },
        },
        parseInt(id)
      );
      res.json({
        status: "ok",
        updatedComment,
      });
    } catch (error: any) {
      res.json({
        status: "error",
        message: error.message,
      });
    }
  }
  
  async deleteComment(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      res.json({
        status: "error",
        message: "Falta ID",
      });
      return;
    }

    try {
      const response = await CommentDataBaseService.deleteDBComment(
        parseInt(id)
      );
      res.json({
        status: "ok",
        message: "Comentário deletado!",
      });
    } catch (error: any) {
      res.json({
        status: "error",
        message: error.message,
      });
    }
  }
}

export default new CommentController();
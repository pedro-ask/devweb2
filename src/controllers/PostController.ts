import { Request, Response } from "express";
import PostDataBaseService from "../services/PostDataBaseService";

class PostController {
  constructor() {}

  async listPosts(req: Request, res: Response) {
    try {
      const posts = await PostDataBaseService.listDBPosts();
      res.json({
        status: "ok",
        posts: posts,
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: "error",
        message: error,
      });
    }
  }

  async createPost(req: Request, res: Response) {
    const body = req.body;

    if (!body.title || !body.authorId) {
      res.json({
        status: "error",
        message: "Faltam parâmetros",
      });
      return;
    }

    try {
      const newPost = await PostDataBaseService.insertDBPost({
        title: body.title,
        content: body.content,
        published: body.published || false,
        author: { connect: { id: parseInt(body.authorId) } },
      });
      res.json({
        status: "ok",
        newPost: newPost,
      });
    } catch (error) {
      res.json({
        status: "error",
        message: error,
      });
    }
  }

  async updatePost(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      res.json({
        status: "error",
        message: "Falta ID",
      });
      return;
    }

    const { title, content, published, authorId } = req.body;

    if (!title || !authorId) {
      res.json({
        status: "error",
        message: "Faltam parâmetros",
      });
      return;
    }

    try {
      const updatedPost = await PostDataBaseService.updateDBPost(
        {
          title: title,
          content: content,
          published: published || false,
          author: { connect: { id: parseInt(authorId) } }, // Relation defined correctly
        },
        parseInt(id)
      );
      res.json({
        status: "ok",
        updatedPost: updatedPost,
      });
    } catch (error) {
      res.json({
        status: "error",
        message: error,
      });
    }
  }

  async deletePost(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      res.json({
        status: "error",
        message: "Falta ID",
      });
      return;
    }

    try {
      const response = await PostDataBaseService.deleteDBPost(parseInt(id));
      if (response) {
        res.json({
          status: "ok",
          message: "Post deletado!",
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        status: "error",
        message: error,
      });
    }
  }
}

export default new PostController();
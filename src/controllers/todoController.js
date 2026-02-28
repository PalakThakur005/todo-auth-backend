import { Todo } from "../models/todo.js";

export const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body || {};
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const todo = await Todo.create({
      user:req.user.id,
      title:req.body.title,
      description:req.body.description,
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getTodo = async (req,res) => {
    try{
   const todos = await Todo.findOne({user:req.user.id})
  res.json(todos);
    }catch(error){
         res.status(500).json({ message: error.message });
    }
}
import { Request, Response } from "express";

const welcome = (req: Request, res: Response): void => {
    res.json({ message: "Welcome Employee!"});
}

export default welcome;
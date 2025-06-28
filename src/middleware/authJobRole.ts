// import { Request, Response, NextFunction } from "express";

// const authJobRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try{
//         const {jobRole} = req.body;
//         //check if jobRole is admin or employee
//         const allowedRoles = ['admin', 'employee'];
//         if (!allowedRoles.includes(jobRole)) {
//             res.status(400).json({ message: 'Invalid job role' });
//             return;
//         }
//     } catch(err: any) {
//         console.error("Internal server error", err.message);
//     }
// }

// const isAdmin 
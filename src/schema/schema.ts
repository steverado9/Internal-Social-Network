import { z } from "zod";

export const createUserSchema = z.object({
    firstname: z.string().min(1, "This field has to be filled"), 
    lastname: z.string().min(1, "This field has to be filled"),
    email: z.string().min(1, "This field has to be filled").email(),
    password: z.string().min(1, "This field has to be filled"),
    job_role: z.string().min(1, "This field has to be filled"),
    gender: z.string().min(1, "This field has to be filled"), 
    department: z.string().min(4, "This field has to be filled"), 
    address: z.string().min(4, "This field has to be filled")
});

export const signinSchema = z.object({
    email: z.string().min(1, "This field has to be filled").email(),
    password: z.string().min(1, "This field has to be filled")
});

export const creategifSchema = z.object({
    title: z.string().min(1, "This field has to be filled"),
    image: z.string().min(1, "This field has to be filled")
});

export const addCommentSchema = z.object({
    comment: z.string().min(1, "This field cannot be empty")
});

export const createArticleSchema = z.object({
    title: z.string().min(1, "This field has to be filled"),
    content: z.string().min(1, "This field has to be filled"),
})

export const editArticleSchema = z.object({
    title: z.string().min(1, "This field has to be filled"),
    content: z.string().min(1, "This field has to be filled"),
})
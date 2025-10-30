import {z} from 'zod'

export const signupSchema = z.object({
    name:z.string().min(1,"Name required"),
    email:z.string().email("Invalid email"),
    password:z.string().min(6, 'Min 6 chars'),
})

export const loginSchema = z.object({
    email:z.string().email(),
    password:z.string().min(1)
})

export const productSchema = z.object({
    name:z.string().min(1),
    price:z.preprocess(val => Number(val),z.number().positive()),
    stock:z.preprocess(val => Number(val),z.number().int().nonnegative()),
    category_id:z.string().uuid().optional().nullable(),
    image_url:z.string().url().optional().nullable(),
    description:z.string().optional(),
})
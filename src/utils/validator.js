// src/utils/validator.js
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const recordSchema = z.object({
  amount: z.coerce.number().positive(),
  type: z.enum(["income", "expense"]),
  category: z.string().min(2),
  date: z.string().datetime().optional(),
  note: z.string().optional(),
});

export const updateRecordSchema = z.object({
  amount: z.coerce.number().positive().optional(),
  type: z.enum(["income", "expense"]).optional(),
  category: z.string().min(2).optional(),
  date: z.string().datetime().optional(),
  note: z.string().optional(),
});
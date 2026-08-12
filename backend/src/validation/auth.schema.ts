import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .trim(),

    email: z
      .string()
      .email("Invalid email address")
      .toLowerCase()
      .trim(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirm_password: z
      .string()
      .min(1, "Please confirm your password"),

  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, "Password is required"),
});

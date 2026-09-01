import z from "zod";

export const signinSchema = z.object({
  email: z.email("E-mail invalido"),
  password: z
    .string()
    .min(6)
    .regex(/[a-z]/, "lowercase")
    .regex(/[A-Z]/, "uppercase")
    .regex(/\d/, "digit")
    .regex(/[\W_]/, "special"),
});

export type SigninSchema = z.infer<typeof signinSchema>;

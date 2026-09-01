import api from "@/lib/axios.config";
import { SigninSchema } from "@/schemas/signin.schema";
import { isAxiosError } from "axios";

//Avançado - react hook form
export async function Signin({ email, password }: SigninSchema) {
  const { status } = await api.post("/signin", { email, password });
  return status;
}

//Basico
export async function BasicSignin(email: string, password: string) {
  try {
    const { status } = await api.post("/signin", { email, password });
    return status;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.status;
    }
    throw new Error();
  }
}

//Basico
export async function CreateAccount(
  name: string,
  email: string,
  password: string
) {
  try {
    const { status } = await api.post("/createAccount", {
      name,
      email,
      password,
    });
    return status;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.status;
    }
    throw new Error();
  }
}

import api from "@/lib/axios.config";
import { SigninSchema } from "@/schemas/signin.schema";
import { isAxiosError } from "axios";
type LoginResponse = {
  id_usuario: number;
  email_usuario: string;
  senha_usuario: string;
  nivel: string;
};

export async function BasicSignin(
  email_usuario: string,
  senha_usuario: string,
) {
  try {
    const { status, data } = await api.post<LoginResponse>("/login", {
      email_usuario,
      senha_usuario,
    });

    return { status, data };
  } catch (error) {
    if (isAxiosError(error)) {
      return null;
    }
    throw new Error();
  }
}

//Basico
export async function CreateAccount(
  email_usuario: string,
  senha_usuario: string,
) {
  try {
    const { status } = await api.post("/cadastro", {
      email_usuario,
      senha_usuario,
    });
    return status;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.status;
    }
    throw new Error();
  }
}
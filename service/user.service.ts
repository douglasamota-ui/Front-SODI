import api from "@/lib/axios.config";
import { SigninSchema } from "@/schemas/signin.schema";
import { isAxiosError } from "axios";


export async function BasicSignin(email_usuario: string, senha_usuario: string) {
  try {
    const { status } = await api.post("/login", { email_usuario, senha_usuario });
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
  
  email_usuario: string,
  senha_usuario: string
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

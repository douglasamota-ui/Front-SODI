import Botao from "@/components/botao/botao";
import CampoDeTexto from "@/components/CampodeTexto/CampodeTexto";
import StyledLinearGradient from "@/components/StyledLinearGradient/StyledLinearGradient";
import "@/global.css";
import { BasicSignin } from "@/service/user.service";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";

const App = () => {
  const router = useRouter();

  const [email_usuario, setEmailUsuario] = useState<string>("");
  const [senha_usuario, setSenhaUsuario] = useState<string>("");

  const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [isErrorInEmail, setIsErrorInEmail] = useState<boolean>(false);

  useEffect(() => {
    if (email_usuario == "") {
      setIsErrorInEmail(false);
    } else {
      if (!regex_email.test(email_usuario)) {
        setIsErrorInEmail(true);
      } else {
        setIsErrorInEmail(false);
      }
    }
  }, [email_usuario]);

  const regex_senha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const [isErrorInSenha, setIsErrorInSenha] = useState<boolean>(false);
  useEffect(() => {
    if (senha_usuario == "") {
      setIsErrorInSenha(false);
    } else {
      if (!regex_senha.test(senha_usuario)) {
        setIsErrorInSenha(true);
      } else {
        setIsErrorInSenha(false);
      }
    }
  }, [senha_usuario]);

  const onSubmit = async (email: string, senha: string) => {
    const resposta = await BasicSignin(email, senha);
    console.log(resposta)
    if (resposta == 200) {
      Alert.alert('SEJA BEM VINDO ✅');
      router.push("/home");
    } else {
      alert("Usuario ou senha incorretos");
    }
  };

  return (
    <StyledLinearGradient
      colors={["#24ca85", "#24ca85"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 justify-center items-center"
    >
      <View className="bg-[#bedbcf] p-6 rounded-2xl">
        <View className="mb-8 items-center">
          <Text className="font-sans text-black text-2xl">LOGIN</Text>
        </View>
        <View className="gap-6">
          <CampoDeTexto
            label="E-mail"
            value={email_usuario}
            setValue={setEmailUsuario}
            errorMessage="E-mail invalido"
            placeholder="Digite o e-mail"
            isError={isErrorInEmail}
          />
          <CampoDeTexto
            label="Senha"
            value={senha_usuario}
            setValue={setSenhaUsuario}
            errorMessage="Senha invalida"
            placeholder="Digite sua senha"
            isError={isErrorInSenha}
          />
        </View>
        <View className="items-center mt-8">
          <Botao
            className="bg-[#24ca85] w-20"
            children={
              <View className=" justify-center items-center">
                <Text className="color-[black] text-white text-xl">ENTRAR</Text>
              </View>
            }
            disabled={
              isErrorInEmail ||
              isErrorInSenha ||
              email_usuario == "" ||
              senha_usuario == ""
                ? true
                : false
            }
            onPress={() => onSubmit(email_usuario, senha_usuario)}
          />
        </View>
        <View className="flex-row justify-center m-6">
          <Link href={"/cadastro"}>
            <Text>CADASTRA-SE</Text>
          </Link>
        </View>
      </View>
    </StyledLinearGradient>
  );
};
export default App;
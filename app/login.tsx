import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CampoDeTexto from "@/components/CampodeTexto/CampodeTexto";
import Botao from "@/components/botao/botao";
import { BasicSignin } from "@/service/user.service";
import { salvarUserId } from "@/lib/secureStore";

export default function Login() {
  const router = useRouter();

  const [email_usuario, setEmailUsuario] = useState<string>("");
  const [senha_usuario, setSenhaUsuario] = useState<string>("");

  const [isErrorInEmail, setIsErrorInEmail] = useState<boolean>(false);
  const [isErrorInSenha, setIsErrorInSenha] = useState<boolean>(false);

  useEffect(() => {
    const verificarLoginSalvo = async () => {
      try {
        const idSalvo = await AsyncStorage.getItem("id_user");
        console.log("ID Salvo no AsyncStorage:", idSalvo);

        if (idSalvo && idSalvo !== "null" && idSalvo !== "undefined") {
          setTimeout(() => {
            router.replace("/home");
          }, 100);
        }
      } catch (error) {
        console.log("Erro ao verificar sessão:", error);
      }
    };

    verificarLoginSalvo();
  }, []);

  const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  useEffect(() => {
    if (email_usuario === "") {
      setIsErrorInEmail(false);
    } else {
      setIsErrorInEmail(!regex_email.test(email_usuario));
    }
  }, [email_usuario]);

  // 3. Validação da Senha
  useEffect(() => {
    if (senha_usuario === "") {
      setIsErrorInSenha(false);
    } else {
      setIsErrorInSenha(senha_usuario.length < 1);
    }
  }, [senha_usuario]);

  // 4. Função de Login Manual
  const onSubmit = async (email: string, senha: string) => {
    try {
      console.log("A enviar dados:", email, senha);
      const resposta = (await BasicSignin(email, senha)) as any;

    
      if (resposta && (resposta.status === 200 || resposta.status === 201)) {
        Alert.alert("Sucesso", "SEJA BEM-VINDO!");

        // // Guarda o ID do utilizador (garantindo que se o servidor retornar na propriedade data ou id_usuario, seja salvo)
        // const userId = resposta.data?.id_usuario || resposta.data?.id || "1";
        // await AsyncStorage.setItem("id_user", String(userId));

        await salvarUserId(JSON.stringify(resposta.data.id_usuario));
        // Redireciona para a home
        router.replace("/home");
      } else {
        Alert.alert("Atenção", "E-mail ou senha incorretos.");
      }
    } catch (error: any) {
      console.log("Erro ao efetuar login:", error);
      Alert.alert(
        "Erro no Login",
        error?.response?.data?.message ||
          "E-mail ou senha inválidos, ou falha na ligação.",
      );
    }
  };

  return (
    <View className="flex-1 items-center">
      <Image
        source={require("@/assets/image/fundoverde.png")}
        style={styles.fundoVerde}
        resizeMode="contain"
      />

      <Image
        source={require("@/assets/image/sodi_logo_preto.jpg")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View className="items-center">
        <View className="mb-8 items-center">
          <Text className="font-sans text-black text-2xl">LOGIN</Text>
        </View>

        <View className="gap-6">
          <CampoDeTexto
            label="E-mail"
            value={email_usuario}
            setValue={setEmailUsuario}
            errorMessage="E-mail inválido"
            placeholder="Digite o e-mail"
            isError={isErrorInEmail}
            textInputClassName="w-80"
          />
          <CampoDeTexto
            label="Senha"
            value={senha_usuario}
            setValue={setSenhaUsuario}
            errorMessage="Senha inválida"
            placeholder="Digite sua senha"
            isError={isErrorInSenha}
            textInputClassName="w-80"
          />
        </View>

        <View className="items-center mt-8">
          <Botao
            className="bg-[#3C8670] w-20 rounded-full"
            disabled={
              isErrorInEmail ||
              isErrorInSenha ||
              email_usuario.trim() === "" ||
              senha_usuario.trim() === ""
            }
            onPress={() => onSubmit(email_usuario, senha_usuario)}
          >
            <View className="justify-center items-center">
              <Text className="text-white text-xl">ENTRAR</Text>
            </View>
          </Botao>
        </View>

        <View className="flex-row justify-center m-6">
          <Link href={"/cadastro"}>
            <Text>CADASTRE-SE</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fundoVerde: {
    position: "absolute",
    width: 300,
    height: 500,
    right: -80,
    top: "35%",
    zIndex: -1,
  },
  logo: {
    width: 120,
    height: 100,
    marginTop: 20,
    marginBottom: 10,
  },
});

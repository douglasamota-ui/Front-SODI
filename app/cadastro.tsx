import Botao from "@/components/BotaoCad/Botaocad";
import CampoDeTexto from "@/components/CampoTextoCad/CampoTextoCad";
import { CreateAccount } from "@/service/user.service";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Cadastro = () => {
  const router = useRouter();

  const [email_usuario, setEmailUsuario] = useState<string>("");
  const [senha_usuario, setSenhaUsuario] = useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");

  const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [isErrorInEmail, setIsErrorInEmail] = useState<boolean>(false);

  useEffect(() => {
    if (email_usuario === "") {
      setIsErrorInEmail(false);
    } else {
      setIsErrorInEmail(!regex_email.test(email_usuario));
    }
  }, [email_usuario]);

  const regex_senha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const [isErrorInSenha, setIsErrorInSenha] = useState<boolean>(false);

  useEffect(() => {
    if (senha_usuario === "") {
      setIsErrorInSenha(false);
    } else {
      setIsErrorInSenha(!regex_senha.test(senha_usuario));
    }
  }, [senha_usuario]);

  const [isErrorInConfirmarSenha, setIsErrorInConfirmarSenha] =
    useState<boolean>(false);

  useEffect(() => {
    if (confirmarSenha === "") {
      setIsErrorInConfirmarSenha(false);
    } else {
      setIsErrorInConfirmarSenha(confirmarSenha !== senha_usuario);
    }
  }, [confirmarSenha, senha_usuario]);

  const onSubmit = async (email: string, senha: string) => {
    const resposta = await CreateAccount(email, senha);
    if (resposta === 201) {
      alert("Conta criada");
      router.back();
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center">
      <KeyboardAvoidingView
        className="flex-1 w-full items-center"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          className="w-full"
          contentContainerClassName="items-center pb-8"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-2xl mb-4">Cadastrar</Text>
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
            <CampoDeTexto
              label="Confirme a senha"
              value={confirmarSenha}
              setValue={setConfirmarSenha}
              errorMessage="As senhas devem ser iguais"
              placeholder="Confirme sua senha"
              isError={isErrorInConfirmarSenha}
              textInputClassName="w-80"
            />
            <View className="flex-row justify-center">
              <Botao
                className="w-20"
                children={
                  <View className="justify-center items-center">
                    <Text className="text-white text-xl">Criar</Text>
                  </View>
                }
                disabled={
                  isErrorInEmail ||
                  isErrorInSenha ||
                  isErrorInConfirmarSenha ||
                  email_usuario === "" ||
                  senha_usuario === "" ||
                  confirmarSenha === ""
                }
                onPress={() => {
                  onSubmit(email_usuario, senha_usuario);
                }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Cadastro;
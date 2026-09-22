import Botao from "@/components/botao/botao"; 
import CampoDeTexto from "@/components/CampodeTexto/CampodeTexto"; 
import StyledLinearGradient from "@/components/StyledLinearGradient/StyledLinearGradient"; 
import "@/global.css"; 
import { BasicSignin } from "@/service/user.service"; 
import { Link, useRouter } from "expo-router"; 
import React, { useEffect, useState } from "react"; 
import { Alert, Text, View, StyleSheet } from "react-native"; 
import { Image } from "expo-image"; 
 
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
 
  console.log(resposta); 
 
  const { status, data } = resposta; 
 
  console.log(status); 
  console.log(data); 
 
  if (status === 200) { 
    Alert.alert("SEJA BEM VINDO ✅"); 
    localStorage.setItem('id_user', data.id_usuario); 
    router.push("/home"); 
  } else { 
    alert("Usuario ou senha incorretos"); 
  } 
}; 
 
  return ( 
    <View className="flex-1 items-center"> 

      <Image 
        source={require("@/assets/image/fundoverde.png")} 
        style={styles.fundoVerde} 
        contentFit="contain" 
      /> 

      <Image 
        source={require("@/assets/image/sodi_logo_preto.jpg")} 
        style={styles.logo} 
        contentFit="contain" 
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
            errorMessage="E-mail invalido" 
            placeholder="Digite o e-mail" 
            isError={isErrorInEmail} 
            textInputClassName="w-80" 
          /> 
          <CampoDeTexto 
            label="Senha" 
            value={senha_usuario} 
            setValue={setSenhaUsuario} 
            errorMessage="Senha invalida" 
            placeholder="Digite sua senha" 
            isError={isErrorInSenha} 
            textInputClassName="w-80" 
          /> 
        </View> 

        <View className="items-center mt-8"> 
          <Botao 
            className="bg-[#3C8670] w-20 rounded-full" 
            children={ 
              <View className="justify-center items-center"> 
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
    </View> 
  ); 
}; 

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
 
export default App;
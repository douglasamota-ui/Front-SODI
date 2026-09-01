import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Image } from "expo-image";
import BotaoCad from "@/components/BotaoCad/Botaocad";

const App = () => {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");

  const [isErrorInEmail, setIsErrorInEmail] = useState<boolean>(false);
  const [isErrorInSenha, setIsErrorInSenha] = useState<boolean>(false);

  const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (email === "") {
      setIsErrorInEmail(false);
    } else {
      if (!regex_email.test(email)) {
        setIsErrorInEmail(true);
      } else {
        setIsErrorInEmail(false);
      }
    }
  }, [email]);

  const regex_senha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  useEffect(() => {
    if (senha === "") {
      setIsErrorInSenha(false);
    } else {
      if (!regex_senha.test(senha)) {
        setIsErrorInSenha(true);
      } else {
        setIsErrorInSenha(false);
      }
    }
  }, [senha]);

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Image
          source={require("@/assets/image/sodi_logo_preto.jpg")}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      <View style={styles.tabContainer}>
        <View style={styles.activeTab}>
          <Text style={styles.activeTabText}>Login</Text>
        </View>
        <View style={styles.inactiveTab}>
          <Text style={styles.inactiveTabText}>Sign Up</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          placeholder="Digite seu e-mail"
          placeholderTextColor="#8e8e93"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Digite sua senha"
          placeholderTextColor="#8e8e93"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
        />

        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput
          placeholder="Confirme sua senha"
          placeholderTextColor="#8e8e93"
          secureTextEntry
          style={styles.input}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <BotaoCad />
      </View>

      <View style={styles.circleDecoration} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    position: "relative",
    paddingTop: 60,
  },
  cabecalho: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 120,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    marginBottom: 20,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#008000",
    paddingBottom: 4,
  },
  activeTabText: {
    color: "#008000",
    fontWeight: "bold",
    fontSize: 18,
  },
  inactiveTab: {
    paddingBottom: 4,
  },
  inactiveTabText: {
    color: "#b0b0b0",
    fontSize: 18,
  },
  form: {
    paddingHorizontal: 20,
    gap: 12,
    zIndex: 2,
  },
  label: {
    color: "#333333",
    fontWeight: "500",
  },
  input: {
    color: "#333333",
    borderWidth: 1,
    borderColor: "#2d8c66",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  circleDecoration: {
    position: "absolute",
    bottom: -80,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#38ce8e",
    opacity: 0.8,
    zIndex: 1,
  },
});

export default App;
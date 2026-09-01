import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const BotaoCad = () => {
  return (
    <TouchableOpacity style={styles.botao}>
      <Text style={styles.texto}>Cadastrar</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botao: {
    width: "100%",
    height: 50,
    backgroundColor: "#24ca85",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  texto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BotaoCad;
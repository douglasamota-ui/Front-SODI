import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

import "@/global.css";

const Administracao = () => {
  const [menuAberto, setMenuAberto] = useState<boolean>(false);

  return (
    <View className="flex-1 bg-white pt-12">

      <View className="w-full flex-row items-center justify-between border-b border-gray-200 pl-6">
        <Pressable
          onPress={() => setMenuAberto(!menuAberto)}
        >
          <Text className="menu">☰</Text>
        </Pressable>

       
          <Image
            source={require("@/assets/image/sodi_logo_preto.jpg")}
            style={styles.logo}
            contentFit="contain"
          />
     

        <Pressable className="p-2">

          <Image
            source={require("@/assets/image/imgdeperf.png")}
            style={styles.logo}
            contentFit="contain"
          />


        </Pressable>
      </View>


      {menuAberto && (
        <View className="absolute top-16 left-0 z-50 w-72 bg-white p-5 border border-gray-300 shadow-lg">
          <Text className="text-xl font-bold mb-5 -[#136d09] bg-blue-500 ">Menu</Text>

          <Pressable className="py-4 border-b border-gray-200">
            <Text className="text-base font-semibold ">Administração</Text>
          </Pressable>

          <Pressable className="py-4 border-b border-gray-200">
            <Text className="text-base  ">Ordem de Serviço</Text>
          </Pressable>

          <Pressable className="py-4">
            <Text className="text-base">Máquinas</Text>
          </Pressable>
        </View>
      )}


      <ScrollView className="flex-1">
        <View className="p-5">

          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900">
              Administração
            </Text>
            <Text className="text-base text-gray-500 mt-1">
              Visão geral do sistema
            </Text>
          </View>


          <View className="gap-4">
            <View className="rounded-2xl p-5 border border-gray-200 bg-gray-50">
              <Text className="text-base font-medium text-gray-700">
                Ordens Abertas
              </Text>
              <Text className="text-4xl font-bold text-gray-900 mt-2">0</Text>
              <Text className="text-sm text-gray-500 mt-1">
                Ordens aguardando atendimento
              </Text>
            </View>

            <View className="rounded-2xl p-5 border border-gray-200 bg-gray-50">
              <Text className="text-base font-medium text-gray-700">
                Em Manutenção
              </Text>
              <Text className="text-4xl font-bold text-gray-900 mt-2">0</Text>
              <Text className="text-sm text-gray-500 mt-1">
                Ordens em andamento
              </Text>
            </View>

            <View className="rounded-2xl p-5 border border-gray-200 bg-gray-50">
              <Text className="text-base font-medium text-gray-700">
                Ordens Concluídas
              </Text>
              <Text className="text-4xl font-bold text-gray-900 mt-2">0</Text>
              <Text className="text-sm text-gray-500 mt-1">
                Ordens finalizadas
              </Text>
            </View>
          </View>


          <View className="rounded-2xl p-5 mt-6 border border-gray-200 bg-gray-50">
            <Text className="text-xl font-bold text-gray-900">
              Cadastro de Máquinas
            </Text>
            <Text className="text-sm text-gray-500 mt-2">
              Gerencie as máquinas cadastradas no sistema.
            </Text>

            <View className="items-center mt-5">
              <Pressable className="w-full">
                <Text className="text-base font-bold text-center">
                  + Adicionar Máquina
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
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
    width: 60,
    height: 60,
  

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
export default Administracao;
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";

import "@/global.css";

const Administracao = () => {
  const [menuAberto, setMenuAberto] = useState<boolean>(false);

  const handleLogout = () => {
    // Não esquecer de adicionar aqui a logica do  logout para sair da pagina
    console.log("Logout clicado");
  };

  return (
    <View className="flex-1 bg-[#F5F7F6] pt-12">

      {/* HEADER */}
      <View className="w-full flex-row items-center justify-between bg-[#24ca85] px-4 py-3 shadow-sm">
        
        {/* BOTÃO MENU HAMBÚRGUER */}
        <Pressable
          onPress={() => setMenuAberto(!menuAberto)}
          className="p-2 active:opacity-70"
        >
          <Text className="text-3xl text-white">☰</Text>
        </Pressable>

        {/* LOGO ZODI */}
        <Image
          source={require("@/assets/image/sodi_logo_preto.jpg")}
          style={styles.logo}
          contentFit="contain"
        />

        {/*  LOGOUT + PERFIL */}
        <View className="flex-row items-center gap-1">
          <Pressable
            onPress={handleLogout}
            className="p-2 active:opacity-70"
            accessibilityLabel="Botão de sair"
          >
            <MaterialIcons name="logout" size={26} color="white" />
          </Pressable>

          <Pressable className="p-2 active:opacity-70">
            <Image
              source={require("@/assets/image/imgdeperf.png")}
              style={styles.logo}
              contentFit="contain"
            />
          </Pressable>
        </View>

      </View>

      {/* MENU HAMBÚRGUER */}
      {menuAberto && (
        <View className="absolute left-0 top-28 z-50 w-72 rounded-br-2xl rounded-tr-2xl border border-[#DDE5E0] bg-white p-5 shadow-2xl">
          <Text className="mb-4 text-xl font-bold text-[#24ca85]">
            Menu
          </Text>

          <Pressable
            onPress={() => setMenuAberto(false)}
            className="border-b border-[#E1E5E3] py-3"
          >
            <Text className="text-base font-bold text-[#24ca85]">
              Administração
            </Text>
          </Pressable>

          <Pressable className="border-b border-[#E1E5E3] py-3">
            <Text className="text-base text-[#3F4442]">
              Ordem de Serviço
            </Text>
          </Pressable>

          <Pressable className="border-b border-[#E1E5E3] py-3">
            <Text className="text-base text-[#3F4442]">
              Máquinas
            </Text>
          </Pressable>

          <Pressable className="border-b border-[#E1E5E3] py-3">
            <Text className="text-base text-[#3F4442]">
              Funcionários
            </Text>
          </Pressable>

          <Pressable className="py-3">
            <Text className="text-base text-[#3F4442]">
              Histórico
            </Text>
          </Pressable>
        </View>
      )}

      {/* CONTEÚDO */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="p-5">

          
          <View className="mb-6">
            <Text className="text-3xl font-bold text-[#202124]">
              Administração
            </Text>
            <Text className="mt-1 text-base text-[#73777A]">
              Visão geral do sistema
            </Text>
          </View>

          {/* CARDS ESTILIZADOS */}
          <View className="gap-4">

            {/* ORDENS ABERTAS */}
            <View className="rounded-2xl bg-[#F88C38] p-5 shadow-sm">
              <Text className="text-lg font-bold text-white">
                Ordens Abertas
              </Text>
              <Text className="mt-2 text-4xl font-extrabold text-white">
                0
              </Text>
              <Text className="mt-1 text-sm text-white/80">
                Ordens aguardando atendimento
              </Text>
            </View>

            {/* EM MANUTENÇÃO */}
            <View className="rounded-2xl bg-[#0081C9] p-5 shadow-sm">
              <Text className="text-lg font-bold text-white">
                Em Manutenção
              </Text>
              <Text className="mt-2 text-4xl font-extrabold text-white">
                0
              </Text>
              <Text className="mt-1 text-sm text-white/80">
                Ordens em andamento
              </Text>
            </View>

            {/* CONCLUÍDAS */}
            <View className="rounded-2xl bg-[#006B38] p-5 shadow-sm">
              <Text className="text-lg font-bold text-white">
                Concluídas
              </Text>
              <Text className="mt-2 text-4xl font-extrabold text-white">
                0
              </Text>
              <Text className="mt-1 text-sm text-white/80">
                Ordens finalizadas
              </Text>
            </View>

            {/* CADASTRO DE MÁQUINAS */}
            <View className="rounded-2xl bg-[#367958] p-5 shadow-sm">
              <Text className="text-xl font-bold text-white">
                Cadastro de Máquinas
              </Text>
              <Text className="mt-1 text-sm text-white/80">
                Gerencie as máquinas cadastradas no sistema
              </Text>

              <Pressable className="mt-5 rounded-xl bg-white py-3.5 active:opacity-90">
                <Text className="text-center text-base font-bold text-[#367958]">
                  Adicionar Máquina
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
  logo: {
    width: 70,
    height: 70,
  },
});

export default Administracao;

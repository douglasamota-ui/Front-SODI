import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

import "@/global.css";

const Administracao = () => {
  const [menuAberto, setMenuAberto] = useState<boolean>(false);

  return (
    <View className="flex-1 bg-[#F5F7F6] pt-12">

      {/* HEADER */}
      <View className="w-full flex-row items-center justify-between border-b border-[#006B32] bg-[#00843D] pl-6">

        <Pressable
          onPress={() => setMenuAberto(!menuAberto)}
          className="p-2"
        >
          <Text className="text-3xl text-white">
            ☰
          </Text>
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

      {/* MENU HAMBÚRGUER BRUNO */}
      {menuAberto && (
        <View className="absolute left-0 top-28 z-50 w-72 rounded-br-2xl rounded-tr-2xl border border-[#DDE5E0] bg-white p-5 shadow-lg">

          <Text className="mb-5 text-xl font-bold text-[#00843D]">
            Menu
          </Text>

          <Pressable
            onPress={() => setMenuAberto(false)}
            className="border-b border-[#E1E5E3] py-4"
          >
            <Text className="text-base font-bold text-[#00843D]">
              Administração
            </Text>
          </Pressable>

          <Pressable className="border-b border-[#E1E5E3] py-4">
            <Text className="text-base text-[#3F4442]">
              Ordem de Serviço
            </Text>
          </Pressable>

          <Pressable className="py-4">
            <Text className="text-base text-[#3F4442]">
              Máquinas
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

          {/* TÍTULO */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-[#202124]">
              Administração
            </Text>

            <Text className="mt-1 text-base text-[#73777A]">
              Visão geral do sistema
            </Text>
          </View>

          {/* CARDS */}
          <View className="gap-4">

            {/* ORDENS ABERTAS */}
            <View className="rounded-2xl border border-[#E1E5E3] bg-white p-5">

              <Text className="text-base font-semibold text-[#3F4442]">
                Ordens Abertas
              </Text>

              <Text className="mt-2 text-4xl font-bold text-[#00843D]">
                0
              </Text>

              <Text className="mt-1 text-sm text-[#73777A]">
                Ordens aguardando atendimento
              </Text>

            </View>

            {/* EM MANUTENÇÃO */}
            <View className="rounded-2xl border border-[#E1E5E3] bg-white p-5">

              <Text className="text-base font-semibold text-[#3F4442]">
                Em Manutenção
              </Text>

              <Text className="mt-2 text-4xl font-bold text-[#00843D]">
                0
              </Text>

              <Text className="mt-1 text-sm text-[#73777A]">
                Ordens em andamento
              </Text>

            </View>

            {/* CONCLUÍDAS */}
            <View className="rounded-2xl border border-[#E1E5E3] bg-white p-5">

              <Text className="text-base font-semibold text-[#3F4442]">
                Ordens Concluídas
              </Text>

              <Text className="mt-2 text-4xl font-bold text-[#00843D]">
                0
              </Text>

              <Text className="mt-1 text-sm text-[#73777A]">
                Ordens finalizadas
              </Text>

            </View>

          </View>

          {/* CADASTRO DE MÁQUINAS */}
          <View className="mt-6 rounded-2xl border border-[#E1E5E3] bg-white p-5">

            <Text className="text-xl font-bold text-[#202124]">
              Cadastro de Máquinas
            </Text>

            <Text className="mt-2 text-sm text-[#73777A]">
              Gerencie as máquinas cadastradas no sistema.
            </Text>

            <View className="mt-5">

              <Pressable className="w-full rounded-xl bg-[#00843D] py-4 active:opacity-80">

                <Text className="text-center text-base font-bold text-white">
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
  logo: {
    width: 60,
    height: 60,
  },
});

export default Administracao;
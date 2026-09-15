import React, { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";

import "@/global.css";

type Ordem = {
  id: number;
  maquina: string;
  descricao: string;
  status: string;
};

const Administracao = () => {
  const [menuAberto, setMenuAberto] = useState<boolean>(false);
  const [modalOrdem, setModalOrdem] = useState<boolean>(false);

  const [maquina, setMaquina] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");

  const [ordens, setOrdens] = useState<Ordem[]>([]);

  const handleLogout = () => {
    console.log("Logout clicado");
  };

  const adicionarOrdem = () => {
    if (maquina.trim() === "" || descricao.trim() === "") {
      return;
    }

    const novaOrdem: Ordem = {
      id: Date.now(),
      maquina: maquina,
      descricao: descricao,
      status: "Aberta",
    };

    setOrdens([...ordens, novaOrdem]);

    setMaquina("");
    setDescricao("");
    setModalOrdem(false);
  };

  const cancelarOrdem = () => {
    setMaquina("");
    setDescricao("");
    setModalOrdem(false);
  };

  const ordensAbertas = ordens.filter(
    (ordem) => ordem.status === "Aberta"
  ).length;

  const ordensManutencao = ordens.filter(
    (ordem) => ordem.status === "Em manutenção"
  ).length;

  const ordensConcluidas = ordens.filter(
    (ordem) => ordem.status === "Concluída"
  ).length;

  return (
    <View className="flex-1 bg-[#F5F7F6] pt-12">

      {/* HEADER */}
      <View className="w-full flex-row items-center justify-between bg-[#24ca85] px-4 py-3 shadow-sm">

        {/* MENU */}
        <Pressable
          onPress={() => setMenuAberto(!menuAberto)}
          className="p-2 active:opacity-70"
        >
          <Text className="text-3xl text-white">☰</Text>
        </Pressable>

        {/* LOGO */}
        <Image
          source={require("@/assets/image/sodi_logo_preto.jpg")}
          style={styles.logo}
          contentFit="contain"
        />

        {/* LOGOUT + PERFIL */}
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

      {/* MENU */}
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
            <View className="rounded-2xl bg-[#F88C38] p-5 shadow-sm">

              <Text className="text-lg font-bold text-white">
                Ordens Abertas
              </Text>

              <Text className="mt-2 text-4xl font-extrabold text-white">
                {ordensAbertas}
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
                {ordensManutencao}
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
                {ordensConcluidas}
              </Text>

              <Text className="mt-1 text-sm text-white/80">
                Ordens finalizadas
              </Text>

            </View>

            {/* NOVA ORDEM */}
            <View className="rounded-2xl bg-white p-5 shadow-sm">

              <Text className="text-xl font-bold text-[#202124]">
                Ordem de Serviço
              </Text>

              <Text className="mt-1 text-sm text-[#73777A]">
                Cadastre uma nova ordem de serviço.
              </Text>

              <Pressable
                onPress={() => setModalOrdem(true)}
                className="mt-5 rounded-xl bg-[#24ca85] py-3.5 active:opacity-90"
              >
                <Text className="text-center text-base font-bold text-white">
                  + Adicionar Ordem
                </Text>
              </Pressable>

            </View>

            {/* MÁQUINAS */}
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

          {/* LISTA DE ORDENS */}
          {ordens.length > 0 && (
            <View className="mt-8">

              <Text className="mb-4 text-2xl font-bold text-[#202124]">
                Ordens cadastradas
              </Text>

              <FlatList
                data={ordens}
                keyExtractor={(ordem) => ordem.id.toString()}
                scrollEnabled={false}
                renderItem={({ item: ordem }) => (
                  <View
                    className="mb-3 rounded-2xl bg-white p-4 shadow-sm"
                  >

                    <View className="flex-row items-center justify-between">

                      <Text className="text-lg font-bold text-[#202124]">
                        Ordem #{ordem.id.toString().slice(-4)}
                      </Text>

                      <View className="rounded-full bg-[#FFF1E6] px-3 py-1">
                        <Text className="text-sm font-bold text-[#F88C38]">
                          {ordem.status}
                        </Text>
                      </View>

                    </View>

                    <Text className="mt-3 text-base font-bold text-[#3F4442]">
                      Máquina: {ordem.maquina}
                    </Text>

                    <Text className="mt-2 text-sm text-[#73777A]">
                      {ordem.descricao}
                    </Text>

                  </View>
                )}
              />

            </View>
          )}

        </View>
      </ScrollView>

      {/* MODAL / FORMULÁRIO DE ORDEM */}
      {modalOrdem && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-black/50 px-5">

          <View className="w-full rounded-3xl bg-white p-6">

            <Text className="text-2xl font-bold text-[#202124]">
              Nova Ordem
            </Text>

            <Text className="mt-1 text-sm text-[#73777A]">
              Preencha os dados da ordem.
            </Text>

            {/* MÁQUINA */}
            <Text className="mt-6 mb-2 text-base font-bold text-[#3F4442]">
              Máquina
            </Text>

            <TextInput
              value={maquina}
              onChangeText={setMaquina}
              placeholder="Digite a máquina"
              className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base"
            />

            {/* DESCRIÇÃO */}
            <Text className="mt-5 mb-2 text-base font-bold text-[#3F4442]">
              Descrição do problema
            </Text>

            <TextInput
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Digite o problema"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base"
              style={styles.textArea}
            />

            {/* BOTÕES */}
            <View className="mt-6 flex-row gap-3">

              <Pressable
                onPress={cancelarOrdem}
                className="flex-1 rounded-xl border border-[#DDE5E0] py-3.5"
              >
                <Text className="text-center font-bold text-[#73777A]">
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                onPress={adicionarOrdem}
                className="flex-1 rounded-xl bg-[#24ca85] py-3.5"
              >
                <Text className="text-center font-bold text-white">
                  Adicionar
                </Text>
              </Pressable>

            </View>

          </View>

        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 70,
    height: 70,
  },

  textArea: {
    height: 100,
  },
});

export default Administracao;



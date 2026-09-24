import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import "@/global.css";
import api from "@/lib/axios.config";
import { obterUserId } from "@/lib/secureStore";

type Ordem = {
  id_ordem: number;
  nome_mecanico?: string;
  data_abertura: string;
  descricao_problema: string;
  status: string;
  id_maquinas: number;
  id_usuario: number;
  status_ia?: string;
  marca?: string;
  imagem?: string;
};

const Administracao = () => {
  const [menuAberto, setMenuAberto] = useState<boolean>(false);
  const [modalOrdem, setModalOrdem] = useState<boolean>(false);

  const [carregando, setCarregando] = useState<boolean>(true);
  const [atualizando, setAtualizando] = useState<boolean>(false);
  const [enviando, setEnviando] = useState<boolean>(false);

  const [maquinaId, setMaquinaId] = useState<string>("");
  const [status, setStatus] = useState<string>("Aberta");
  const [dataAbertura, setDataAbertura] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [descricao, setDescricao] = useState<string>("");
  const [marca, setMarca] = useState<string>("");
  const [nomeMecanico, setNomeMecanico] = useState<string>("");
  const [imagemUri, setImagemUri] = useState<string | null>(null);

  const [ordens, setOrdens] = useState<Ordem[]>([]);

  const carregarOrdens = useCallback(async () => {
    const { data } = await api.get<Ordem[]>("/ordensservico");
    setOrdens(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarOrdens()
        .catch((error) => {
          console.error(error);
          Alert.alert(
            "Erro",
            "Não foi possível carregar as ordens de serviço."
          );
        })
        .finally(() => setCarregando(false));
    }, [carregarOrdens])
  );

  const aoAtualizar = async () => {
    setAtualizando(true);

    try {
      await carregarOrdens();
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erro",
        "Não foi possível atualizar as ordens de serviço."
      );
    } finally {
      setAtualizando(false);
    }
  };

  // FUNÇÕES PARA IMAGEM
  const selecionarImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImagemUri(result.assets[0].uri);
    }
  };

  const tirarFoto = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (cameraStatus !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "É necessária a permissão de acesso à câmera para tirar fotos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImagemUri(result.assets[0].uri);
    }
  };

  const adicionarOrdem = async () => {
    if (!maquinaId.trim() || !descricao.trim()) {
      Alert.alert(
        "Atenção",
        "Preencha o ID da máquina e a descrição do problema!"
      );
      return;
    }

    const userId = await obterUserId();

    if (!userId) {
      Alert.alert("Erro", "Usuário não encontrado.");
      return;
    }

    const novaOrdem = {
      id_maquinas: Number(maquinaId),
      status: status.trim() || "Aberta",
      data_abertura:
        dataAbertura.trim() || new Date().toISOString().split("T")[0],
      descricao_problema: descricao,
      marca: marca.trim(),
      nome_mecanico: nomeMecanico.trim() || "A definir",
      imagem: imagemUri || "",
      id_usuario: Number(userId),
      status_ia: "Pendente",
    };

    try {
      setEnviando(true);

      const { data } = await api.post<Ordem>(
        "/ordensservico",
        novaOrdem
      );

      setOrdens((prev) => [...prev, data]);

      cancelarOrdem();

      Alert.alert(
        "Sucesso",
        "Ordem de serviço cadastrada com sucesso!"
      );
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erro",
        "Falha ao salvar a ordem de serviço."
      );
    } finally {
      setEnviando(false);
    }
  };

  const cancelarOrdem = () => {
    setMaquinaId("");
    setStatus("Aberta");
    setDataAbertura(new Date().toISOString().split("T")[0]);
    setDescricao("");
    setMarca("");
    setNomeMecanico("");
    setImagemUri(null);
    setModalOrdem(false);
  };

  const handleLogout = () => {
    console.log("Logout clicado");
  };

  const ordensAbertas = ordens.filter(
    (o) => o.status === "Aberta"
  ).length;

  const ordensManutencao = ordens.filter(
    (o) => o.status === "Em manutenção"
  ).length;

  const ordensConcluidas = ordens.filter(
    (o) => o.status === "Concluída"
  ).length;

  return (
    <View className="flex-1 bg-[#F5F7F6] pt-12">
      {/* HEADER */}
      <View className="w-full flex-row items-center justify-between bg-[#24ca85] px-4 py-3 shadow-sm">
        <Pressable
          onPress={() => setMenuAberto(!menuAberto)}
          className="p-2 active:opacity-70"
        >
          <Text className="text-3xl text-white">☰</Text>
        </Pressable>

        <Image
          source={require("@/assets/image/sodi_logo_preto.jpg")}
          style={styles.logo}
          contentFit="contain"
        />

        <View className="flex-row items-center gap-1">
          <Pressable
            onPress={handleLogout}
            className="p-2 active:opacity-70"
          >
            <MaterialIcons
              name="logout"
              size={26}
              color="white"
            />
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

      {/* MENU LATERAL */}
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

      {/* CONTEÚDO PRINCIPAL */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={aoAtualizar}
          />
        }
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

          {/* CARDS RESUMO */}
          <View className="gap-4">
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
          </View>

          {/* LISTA DE ORDENS CADASTRADAS */}
          {carregando ? (
            <ActivityIndicator
              size="large"
              className="mt-8"
            />
          ) : (
            ordens.length > 0 && (
              <View className="mt-8">
                <Text className="mb-4 text-2xl font-bold text-[#202124]">
                  Ordens cadastradas
                </Text>

                <FlatList
                  data={ordens}
                  keyExtractor={(item) => String(item.id_ordem)}
                  scrollEnabled={false}
                  renderItem={({ item: ordem }) => (
                    <View className="mb-3 rounded-2xl bg-white p-4 shadow-sm">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-lg font-bold text-[#202124]">
                          Ordem #{ordem.id_ordem}
                        </Text>

                        <View className="rounded-full bg-[#FFF1E6] px-3 py-1">
                          <Text className="text-sm font-bold text-[#F88C38]">
                            {ordem.status}
                          </Text>
                        </View>
                      </View>

                      <Text className="mt-3 text-base font-bold text-[#3F4442]">
                        ID Máquina: {ordem.id_maquinas}
                      </Text>

                      <Text className="mt-1 text-sm text-[#73777A]">
                        {ordem.descricao_problema}
                      </Text>

                      {ordem.data_abertura && (
                        <Text className="mt-2 text-xs text-[#9E9E9E]">
                          Data: {ordem.data_abertura}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>
            )
          )}
        </View>
      </ScrollView>

      {/* MODAL DE CADASTRO */}
      {modalOrdem && (
        <View className="absolute inset-0 z-50 bg-black/50">
          <ScrollView
            className="flex-1 px-5"
            contentContainerStyle={{
              paddingVertical: 20,
              justifyContent: "center",
            }}
            showsVerticalScrollIndicator={false}
          >
            <View className="w-full rounded-3xl bg-white p-6 my-auto">
              <Text className="text-2xl font-bold text-[#202124]">
                Nova Ordem
              </Text>

              {/* ID MÁQUINA */}
              <Text className="mt-4 mb-1 text-base font-bold text-[#3F4442]">
                Id Máquina
              </Text>

              <TextInput
                value={maquinaId}
                onChangeText={setMaquinaId}
                placeholder="Selecione o ID da máquina..."
                keyboardType="numeric"
                className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base text-[#202124]"
              />

              {/* STATUS */}
              <Text className="mt-4 mb-1 text-base font-bold text-[#3F4442]">
                Status
              </Text>

              <TextInput
                value={status}
                onChangeText={setStatus}
                placeholder="Ex: Aberta, Manutenção, Concluida"
                className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base text-[#202124]"
              />

              {/* DATA DE ABERTURA */}
              <Text className="mt-4 mb-1 text-base font-bold text-[#3F4442]">
                Data de Abertura
              </Text>

              <TextInput
                value={dataAbertura}
                onChangeText={setDataAbertura}
                placeholder="AAAA-MM-DD"
                className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base text-[#202124]"
              />

              {/* DESCRIÇÃO DO PROBLEMA */}
              <Text className="mt-4 mb-1 text-base font-bold text-[#3F4442]">
                Descrição do Problema
              </Text>

              <TextInput
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Descreva o problema..."
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
                className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base text-[#202124]"
              />

              {/* MARCA */}
              <Text className="mt-4 mb-1 text-base font-bold text-[#3F4442]">
                Marca
              </Text>

              <TextInput
                value={marca}
                onChangeText={setMarca}
                placeholder="Digite a marca..."
                className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base text-[#202124]"
              />

              {/* NOME DO MECÂNICO */}
              <Text className="mt-4 mb-1 text-base font-bold text-[#3F4442]">
                Nome do Mecânico
              </Text>

              <TextInput
                value={nomeMecanico}
                onChangeText={setNomeMecanico}
                placeholder="Digite o nome do mecânico..."
                className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base text-[#202124]"
              />

              {/* IMAGEM DO PROBLEMA */}
              <Text className="mt-5 mb-2 text-lg font-bold text-[#202124]">
                Imagem do Problema
              </Text>

              {imagemUri && (
                <View className="mb-3 items-center">
                  <Image
                    source={{ uri: imagemUri }}
                    style={{ width: "100%", height: 160, borderRadius: 12 }}
                    contentFit="cover"
                  />
                </View>
              )}

              <View className="items-center justify-center rounded-2xl border border-dashed border-[#DDE5E0] p-6 bg-[#FAFAFA]">
                <Pressable
                  onPress={selecionarImagem}
                  className="active:opacity-70"
                >
                  <Text className="text-base text-[#73777A]">
                    {imagemUri ? "Trocar imagem" : "Selecionar imagem"}
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={tirarFoto}
                className="mt-3 flex-row items-center gap-2 active:opacity-70"
              >
                <MaterialIcons
                  name="photo-camera"
                  size={20}
                  color="#73777A"
                />
                <Text className="text-sm font-semibold text-[#73777A]">
                  Tirar foto
                </Text>
              </Pressable>

              {/* BOTÕES */}
              <View className="mt-6 flex-row gap-3">
                <Pressable
                  onPress={adicionarOrdem}
                  disabled={enviando}
                  className="flex-1 rounded-xl bg-[#24ca85] py-3.5 active:opacity-90"
                >
                  {enviando ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-center font-bold text-white">
                      Salvar
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={cancelarOrdem}
                  disabled={enviando}
                  className="flex-1 rounded-xl bg-[#4A4A4A] py-3.5 active:opacity-90"
                >
                  <Text className="text-center font-bold text-white">
                    Cancelar
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
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
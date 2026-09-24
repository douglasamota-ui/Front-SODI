import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const [mostrarForm, setMostrarForm] = useState<boolean>(false);

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
    try {
      const { data } = await api.get<Ordem[]>("/ordensservico");

      if (Array.isArray(data)) {
        setOrdens(data);
      }
    } catch (error) {
      console.error("Erro ao buscar ordens:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar as ordens de serviço."
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarOrdens().finally(() => setCarregando(false));
    }, [carregarOrdens])
  );

  const aoAtualizar = async () => {
    setAtualizando(true);

    try {
      await carregarOrdens();
    } catch (error) {
      console.error(error);
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

  const limparFormulario = () => {
    setMaquinaId("");
    setStatus("Aberta");
    setDataAbertura(new Date().toISOString().split("T")[0]);
    setDescricao("");
    setMarca("");
    setNomeMecanico("");
    setImagemUri(null);
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
        dataAbertura.trim() ||
        new Date().toISOString().split("T")[0],
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

      setOrdens((prev) => [data, ...prev]);

      Alert.alert(
        "Sucesso",
        "Ordem de serviço cadastrada com sucesso!"
      );

      limparFormulario();
      setMostrarForm(false);
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
    limparFormulario();
    setMostrarForm(false);
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
    <SafeAreaView
      className="flex-1 bg-[#24ca85]"
      edges={["top", "left", "right"]}
    >
      {/* HEADER */}
      <View className="bg-[#24ca85] px-4 py-2 flex-row items-center justify-between">
        <Pressable
          onPress={() => setMenuAberto(!menuAberto)}
          className="p-2"
        >
          <Text className="text-3xl text-white">☰</Text>
        </Pressable>

        <Image
          source={require("@/assets/image/sodi_logo_preto.jpg")}
          className="w-14 h-14 rounded-full"
          contentFit="contain"
        />

        <Pressable
          onPress={handleLogout}
          className="p-2 items-center justify-center bg-white/20 rounded-lg"
        >
          <Text className="text-white font-bold text-xs">
            Sair
          </Text>
        </Pressable>
      </View>

      {/* MENU */}
      {menuAberto && (
        <View className="absolute left-0 top-24 z-50 w-72 rounded-br-2xl rounded-tr-2xl border border-gray-200 bg-white p-5 shadow-2xl">
          <Text className="mb-4 text-xl font-bold text-[#24ca85]">
            Menu
          </Text>

          <Pressable
            onPress={() => setMenuAberto(false)}
            className="border-b border-gray-200 py-3"
          >
            <Text className="text-base font-bold text-[#24ca85]">
              Administração
            </Text>
          </Pressable>

          <Pressable className="border-b border-gray-200 py-3">
            <Text className="text-base text-gray-700">
              Ordem de Serviço
            </Text>
          </Pressable>

          <Pressable className="border-b border-gray-200 py-3">
            <Text className="text-base text-gray-700">
              Máquinas
            </Text>
          </Pressable>

          <Pressable className="border-b border-gray-200 py-3">
            <Text className="text-base text-gray-700">
              Funcionários
            </Text>
          </Pressable>

          <Pressable className="py-3">
            <Text className="text-base text-gray-700">
              Histórico
            </Text>
          </Pressable>
        </View>
      )}

      {/* CONTEÚDO */}
      <View className="flex-1 bg-white">
        {carregando ? (
          <Text className="text-center text-gray-500 mt-10">
            Carregando...
          </Text>
        ) : (
          <FlatList
            className="flex-1"
            data={ordens}
            keyExtractor={(item, index) =>
              String(item.id_ordem ?? index)
            }
            contentContainerStyle={{ padding: 16 }}
            refreshControl={
              <RefreshControl
                refreshing={atualizando}
                onRefresh={aoAtualizar}
              />
            }
            ListHeaderComponent={
              <View>
                {/* TÍTULO */}
                <View className="mb-5">
                  <Text className="text-3xl font-bold text-[#202124]">
                    Administração
                  </Text>

                  <Text className="mt-1 text-base text-[#73777A]">
                    Visão geral do sistema
                  </Text>
                </View>

                {/* CARDS */}
                <View className="gap-4 mb-5">
                  <View className="rounded-2xl bg-[#F88C38] p-5">
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

                  <View className="rounded-2xl bg-[#0081C9] p-5">
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

                  <View className="rounded-2xl bg-[#006B38] p-5">
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
                </View>

                {/* BOTÃO NOVA ORDEM */}
                {!mostrarForm ? (
                  <Pressable
                    onPress={() => setMostrarForm(true)}
                    className="bg-[#24ca85] py-3 rounded-xl items-center mb-5"
                  >
                    <Text className="text-white font-bold text-base">
                      Criar nova ordem
                    </Text>
                  </Pressable>
                ) : (
                  /* FORMULÁRIO */
                  <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-5">
                    <Text className="text-lg font-bold text-gray-800 mb-3">
                      Nova Ordem
                    </Text>

                    {/* ID MÁQUINA */}
                    <View className="mb-3">
                      <Text className="text-sm font-bold text-gray-700 mb-1">
                        Id Máquina
                      </Text>

                      <TextInput
                        value={maquinaId}
                        onChangeText={setMaquinaId}
                        placeholder="Digite o ID da máquina..."
                        keyboardType="numeric"
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-gray-800 text-[15px]"
                      />
                    </View>

                    {/* STATUS */}
                    <View className="mb-3">
                      <Text className="text-sm font-bold text-gray-700 mb-1">
                        Status
                      </Text>

                      <TextInput
                        value={status}
                        onChangeText={setStatus}
                        placeholder="Ex: Aberta, Manutenção, Concluída"
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-gray-800 text-[15px]"
                      />
                    </View>

                    {/* DATA */}
                    <View className="mb-3">
                      <Text className="text-sm font-bold text-gray-700 mb-1">
                        Data de Abertura
                      </Text>

                      <TextInput
                        value={dataAbertura}
                        onChangeText={setDataAbertura}
                        placeholder="AAAA-MM-DD"
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-gray-800 text-[15px]"
                      />
                    </View>

                    {/* DESCRIÇÃO */}
                    <View className="mb-3">
                      <Text className="text-sm font-bold text-gray-700 mb-1">
                        Descrição do Problema
                      </Text>

                      <TextInput
                        value={descricao}
                        onChangeText={setDescricao}
                        placeholder="Descreva o problema..."
                        multiline={true}
                        numberOfLines={3}
                        textAlignVertical="top"
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-gray-800 text-[15px]"
                      />
                    </View>

                    {/* MARCA */}
                    <View className="mb-3">
                      <Text className="text-sm font-bold text-gray-700 mb-1">
                        Marca
                      </Text>

                      <TextInput
                        value={marca}
                        onChangeText={setMarca}
                        placeholder="Digite a marca..."
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-gray-800 text-[15px]"
                      />
                    </View>

                    {/* MECÂNICO */}
                    <View className="mb-3">
                      <Text className="text-sm font-bold text-gray-700 mb-1">
                        Nome do Mecânico
                      </Text>

                      <TextInput
                        value={nomeMecanico}
                        onChangeText={setNomeMecanico}
                        placeholder="Digite o nome do mecânico..."
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-gray-800 text-[15px]"
                      />
                    </View>

                    {/* IMAGEM */}
                    <Text className="text-sm font-bold text-gray-700 mb-1">
                      Imagem do Problema
                    </Text>

                    {imagemUri && (
                      <View className="mb-3 items-center">
                        <Image
                          source={{ uri: imagemUri }}
                          style={{
                            width: "100%",
                            height: 160,
                            borderRadius: 12,
                          }}
                          contentFit="cover"
                        />
                      </View>
                    )}

                    <View className="items-center justify-center rounded-xl border border-dashed border-gray-300 p-5 bg-gray-50">
                      <Pressable
                        onPress={selecionarImagem}
                        className="active:opacity-70"
                      >
                        <Text className="text-base text-gray-500">
                          {imagemUri
                            ? "Trocar imagem"
                            : "Selecionar imagem"}
                        </Text>
                      </Pressable>
                    </View>

                    <Pressable
                      onPress={tirarFoto}
                      className="mt-3 flex-row items-center gap-2"
                    >
                      <MaterialIcons
                        name="photo-camera"
                        size={20}
                        color="#73777A"
                      />

                      <Text className="text-sm font-semibold text-gray-500">
                        Tirar foto
                      </Text>
                    </Pressable>

                    {/* BOTÕES */}
                    <View className="flex-row justify-between gap-3 mt-5">
                      <Pressable
                        onPress={adicionarOrdem}
                        disabled={enviando}
                        className="flex-1 bg-[#24ca85] py-3 rounded-xl items-center"
                      >
                        {enviando ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          <Text className="text-white font-bold text-[15px]">
                            Salvar
                          </Text>
                        )}
                      </Pressable>

                      <Pressable
                        onPress={cancelarOrdem}
                        disabled={enviando}
                        className="flex-1 bg-[#4A4A4A] py-3 rounded-xl items-center"
                      >
                        <Text className="text-white font-bold text-[15px]">
                          Cancelar
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}

                {/* TÍTULO DA LISTA */}
                {ordens.length > 0 && (
                  <Text className="text-xl font-bold text-gray-800 mb-4">
                    Ordens cadastradas
                  </Text>
                )}
              </View>
            }
            renderItem={({ item: ordem }) => (
              <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-200">
                <Text className="text-gray-800 text-sm my-[2px]">
                  <Text className="font-bold">Ordem:</Text>{" "}
                  #{ordem.id_ordem}
                </Text>

                <Text className="text-gray-800 text-sm my-[2px]">
                  <Text className="font-bold">Máquina:</Text>{" "}
                  {ordem.id_maquinas || "N/A"}
                </Text>

                <Text className="text-gray-800 text-sm my-[2px]">
                  <Text className="font-bold">Status:</Text>{" "}
                  {ordem.status}
                </Text>

                <Text className="text-gray-800 text-sm my-[2px]">
                  <Text className="font-bold">
                    Data Abertura:
                  </Text>{" "}
                  {ordem.data_abertura || "N/A"}
                </Text>

                <Text className="text-gray-800 text-sm my-[2px]">
                  <Text className="font-bold">Descrição:</Text>{" "}
                  {ordem.descricao_problema || "N/A"}
                </Text>

                <Text className="text-gray-800 text-sm my-[2px]">
                  <Text className="font-bold">Marca:</Text>{" "}
                  {ordem.marca || "N/A"}
                </Text>

                <Text className="text-gray-800 text-sm my-[2px]">
                  <Text className="font-bold">Mecânico:</Text>{" "}
                  {ordem.nome_mecanico || "N/A"}
                </Text>

                {ordem.status_ia && (
                  <Text className="text-gray-800 text-sm my-[2px]">
                    <Text className="font-bold">Status IA:</Text>{" "}
                    {ordem.status_ia}
                  </Text>
                )}

                {ordem.imagem && (
                  <Image
                    source={{ uri: ordem.imagem }}
                    style={styles.imagemOrdem}
                    contentFit="cover"
                  />
                )}
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-center text-gray-400 mt-10">
                Nenhuma ordem encontrada
              </Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imagemOrdem: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginTop: 10,
  },
});

export default Administracao;
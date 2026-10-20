import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import ComponentsHome from "@/components/ComponentsHome/ComponentsHome";
import SeletorDeImagem from "@/components/SeletorDeImagem/SeletorDeImagem";
import * as ImagePicker from "expo-image-picker";
import api from "@/lib/axios.config";
import { obterUserId, removerUserId } from "@/lib/secureStore";
import { bytesToBase64 } from "@/lib/base64";

export type Ordem = {
  id_ordem?: string | number;
  id_maquinas?: string | number;
  status: string;
  data_abertura?: string;
  descricao_problema?: string;
  marca_maquina?: string;
  nome_mecanico?: string;
  id_usuario?: string | number;
  status_ia?: string;
  data?: {
    type: string;
    data: number[];
  };
  mimetype?: string;
  name?: string;
};

const Home = () => {
  const router = useRouter();

  const [mostrarForm, setMostrarForm] = useState<boolean>(false);
  const [modalMaquinasVisible, setModalMaquinasVisible] =
    useState<boolean>(false);
  const [modalMarcaVisible, setModalMarcaVisible] = useState<boolean>(false);
  const [busca, setBusca] = useState<string>("");
  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [clicouSalvar, setClicouSalvar] = useState<boolean>(false);

  const [imagem, setImagem] = useState<ImagePicker.ImagePickerAsset | null>(
    null,
  );

  const ordensFiltradas = ordens.filter((ordem) => {
    const textoBusca = busca.toLowerCase().trim();

    return (String(ordem.id_ordem || "").toLowerCase().includes(textoBusca) ||
      String(ordem.id_maquinas || "").toLowerCase().includes(textoBusca) ||
      String(ordem.status || "").toLowerCase().includes(textoBusca) ||
      String(ordem.data_abertura || "").toLowerCase().includes(textoBusca) ||
      String(ordem.descricao_problema || "").toLowerCase().includes(textoBusca) ||
      String(ordem.marca_maquina || "").toLowerCase().includes(textoBusca) ||
      String(ordem.nome_mecanico || "").toLowerCase().includes(textoBusca) ||
      String(ordem.status_ia || "").toLowerCase().includes(textoBusca)
    );
  });

  const [form, setForm] = useState<Ordem>({
    id_maquinas: "",
    status: "",
    data_abertura: "",
    descricao_problema: "",
    marca_maquina: "",
    nome_mecanico: "",
    id_usuario: "",
    status_ia: "Pendente",
  });

  const isMaquinaValid = String(form.id_maquinas || "").trim().length >= 1;
  const isStatusValid = (form.status || "").length >= 1;
  const isDataAberturaValid = (form.data_abertura || "").length >= 4;
  const isDescricaoValid = (form.descricao_problema || "").length >= 5;
  const isMarcaValid = (form.marca_maquina || "").length >= 5;
  const isMecanicoValid = (form.nome_mecanico || "").length >= 5;

  const carregarOrdens = useCallback(async () => {
    try {
      let id = Number(await obterUserId());
      const { data } = await api.get(`/ordensservico/${id}`);

      setOrdens(data);
    } catch (error) {
      console.log("Erro ao buscar ordens:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarOrdens().finally(() => setCarregando(false));
    }, [carregarOrdens]),
  );

  async function handleLogout() {
    await removerUserId();
    router.replace("/");
  }

  async function handleSalvar() {
    setClicouSalvar(true);

    if (
      !isMaquinaValid ||
      !isStatusValid ||
      !isDataAberturaValid ||
      !isDescricaoValid ||
      !isMarcaValid ||
      !isMecanicoValid
    ) {
      alert("Aviso: Preencha todos os campos corretamente.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("id_maquinas", String(form.id_maquinas));
      formData.append("status", form.status);
      formData.append("data_abertura", form.data_abertura || "");
      formData.append("descricao_problema", form.descricao_problema || "");
      formData.append("marca_maquina", form.marca_maquina || "");
      formData.append("nome_mecanico", form.nome_mecanico || "");
      formData.append("id_usuario", String(await obterUserId()));
      formData.append("status_ia", form.status_ia || "Pendente");

      if (imagem) {
        formData.append("imagem", {
          uri: imagem.uri,
          name: imagem.fileName || "imagem.jpg",
          type: imagem.mimeType || "image/jpeg",
        } as any);
      }

      const resposta = await api.post("/ordensservico", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (resposta.status === 201) {
        alert("Sucesso: Ordem criada com sucesso!");
        await carregarOrdens();
      }
    } catch (erro) {
      console.log("Erro na requisição:", erro);
      alert("Aviso: Erro ao conectar com o servidor.");
    } finally {
      setMostrarForm(false);
      setClicouSalvar(false);
      setImagem(null);

      setForm({
        nome_mecanico: "",
        data_abertura: "",
        descricao_problema: "",
        marca_maquina: "",
        status: "",
        id_maquinas: "",
        id_usuario: "",
        status_ia: "Pendente",
      });
    }
  }

  return (
    <SafeAreaView
      className="flex-1 bg-[#24ca85]"
      edges={["top", "left", "right"]}
    >
      <View className="bg-[#24ca85] pt-2 pb-4 px-4 flex-row items-center justify-between gap-3">
        <Image
          source={require("@/assets/image/sodi_logo_preto.jpg")}
          style={{
            width: 60,
            height: 50,
            alignSelf: "center",
          }}
          contentFit="contain"
        />
        <View className="flex-1 bg-white rounded-full px-4 justify-center h-10">
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar ordem..."
            placeholderTextColor="#6B7280"
            underlineColorAndroid="transparent"
            className="flex-1 text-sm text-black h-full focus:outline-none"
          />
        </View>

        <Pressable
          onPress={handleLogout}
          className="p-2 items-center justify-center rounded-lg"
        >
          <Ionicons name="log-out-outline" size={25} color="white" />
        </Pressable>
      </View>

      <View className="flex-1 bg-white">
        {carregando ? (
          <Text className="text-center text-gray-500 mt-10">Carregando...</Text>
        ) : (
          <FlatList
            className="flex-1"
            data={ordensFiltradas}
            keyExtractor={(item, index) => String(item.id_ordem ?? index)}
            contentContainerStyle={{ padding: 16 }}
            ListHeaderComponent={
              <View>
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
                  <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-5">
                    <Text className="text-lg font-bold text-gray-800 mb-3">
                      Nova Ordem
                    </Text>

                    <View className="mb-3">
                      <Text className="text-sm font-medium text-gray-700 mb-1">
                        Id Máquina
                      </Text>

                      <Pressable
                        onPress={() => setModalMaquinasVisible(true)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 flex-row justify-between items-center"
                      >
                        <Text
                          className={
                            form.id_maquinas
                              ? "text-black text-sm"
                              : "text-gray-400 text-sm"
                          }
                        >
                          {form.id_maquinas
                            ? `Máquina ${form.id_maquinas}`
                            : "Selecione o ID da máquina"}
                        </Text>

                        <Text className="text-gray-400 text-xs">▼</Text>
                      </Pressable>
                    </View>

                    {clicouSalvar && !isMaquinaValid && (
                      <Text className="text-red-500 text-xs -mt-2 mb-2">
                        Id da máquina inválido
                      </Text>
                    )}

                    <ComponentsHome
                      label="Status"
                      placeholder="Ex: Aberta, Manutenção, Concluida"
                      value={form.status}
                      setValue={(text) => setForm({ ...form, status: text })}
                    />

                    {clicouSalvar && !isStatusValid && (
                      <Text className="text-red-500 text-xs -mt-2 mb-2">
                        Status inválido
                      </Text>
                    )}

                    <ComponentsHome
                      label="Data de Abertura"
                      value={form.data_abertura || ""}
                      setValue={(text) =>
                        setForm({ ...form, data_abertura: text })
                      }
                    />

                    {clicouSalvar && !isDataAberturaValid && (
                      <Text className="text-red-500 text-xs -mt-2 mb-2">
                        Data de abertura inválida
                      </Text>
                    )}

                    <ComponentsHome
                      label="Descrição do Problema"
                      value={form.descricao_problema || ""}
                      setValue={(text) =>
                        setForm({ ...form, descricao_problema: text })
                      }
                    />

                    {clicouSalvar && !isDescricaoValid && (
                      <Text className="text-red-500 text-xs -mt-2 mb-2">
                        Descrição muito curta
                      </Text>
                    )}

                    <View className="mb-3">
                      <Text className="text-sm font-medium text-gray-700 mb-1">
                        Marca
                      </Text>

                      <Pressable
                        onPress={() => setModalMarcaVisible(true)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 flex-row justify-between items-center"
                      >
                        <Text
                          className={
                            form.marca_maquina
                              ? "text-black text-sm"
                              : "text-gray-400 text-sm"
                          }
                        >
                          {form.marca_maquina || "Selecione a marca"}
                        </Text>

                        <Text className="text-gray-400 text-xs">▼</Text>
                      </Pressable>

                      {clicouSalvar && !isMarcaValid && (
                        <Text className="text-red-500 text-xs mt-1">
                          Selecione a marca da máquina
                        </Text>
                      )}
                    </View>

                    <ComponentsHome
                      label="Nome do Mecânico"
                      value={form.nome_mecanico || ""}
                      setValue={(text) =>
                        setForm({ ...form, nome_mecanico: text })
                      }
                    />

                    {clicouSalvar && !isMecanicoValid && (
                      <Text className="text-red-500 text-xs -mt-2 mb-2">
                        Nome do mecânico inválido
                      </Text>
                    )}

                    <SeletorDeImagem
                      label="Imagem do Problema"
                      value={imagem}
                      setValue={setImagem}
                      isError={false}
                      errorMessage="Selecione uma imagem da máquina"
                    />

                    <View className="flex-row justify-between gap-3 mt-3">
                      <Pressable
                        onPress={handleSalvar}
                        className="flex-1 bg-[#24ca85] py-3 rounded-xl items-center"
                      >
                        <Text className="text-white font-bold text-[15px]">
                          Salvar
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => {
                          setMostrarForm(false);
                          setClicouSalvar(false);
                          setImagem(null);
                        }}
                        className="flex-1 bg-[#4A4A4A] py-3 rounded-xl items-center"
                      >
                        <Text className="text-white font-bold text-[15px]">
                          Cancelar
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            }
            renderItem={({ item: ordem }) => (
              <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-200">
                <Text className="text-gray-800 text-sm my-[2px]">
                  <Text className="font-bold">Máquina:</Text>{" "}
                  {ordem.id_maquinas || "N/A"}
                </Text>

                <Text className="text-gray-800 text-sm my-[2px]">
                  <Text className="font-bold">Status:</Text> {ordem.status}
                </Text>

                <Text className="text-gray-800 text-sm my-[2px]">
                  <Text className="font-bold">Data Abertura:</Text>{" "}
                  {ordem.data_abertura || "N/A"}
                </Text>

                <Text className="text-gray-800 text-sm my-[2px]">
                  <Text className="font-bold">Descrição:</Text>{" "}
                  {ordem.descricao_problema || "N/A"}
                </Text>

                <Text className="text-gray-800 text-sm my-[2px]">
                  <Text className="font-bold">Marca:</Text>{" "}
                  {ordem.marca_maquina || "Valtra"}
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

                {ordem.data?.data && (
                  <Image
                    source={{
                      uri: `data:${ordem.mimetype || "image/jpeg"};base64,${bytesToBase64(ordem.data.data)}`,
                    }}
                    style={{
                      width: "100%",
                      height: 200,
                      borderRadius: 12,
                      marginTop: 12,
                    }}
                    contentFit="contain"
                    onError={(erro) =>
                      console.log("Erro ao carregar imagem:", erro)
                    }
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

      <Modal
        visible={modalMaquinasVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalMaquinasVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-lg">
            <Text className="text-lg font-bold text-gray-800 text-center mb-4">
              Selecione o ID da Máquina
            </Text>

            <View className="flex-row flex-wrap justify-between gap-2 mb-4">
              <Pressable
                onPress={() => {
                  setForm({ ...form, id_maquinas: 1 });
                  setModalMaquinasVisible(false);
                }}
                className={`w-[48%] p-3 rounded-xl border items-center ${
                  String(form.id_maquinas) === "1"
                    ? "bg-[#24ca85] border-[#24ca85]"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <Text
                  className={`font-bold text-xs text-center ${
                    String(form.id_maquinas) === "1"
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  YAKUZA – 1
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setForm({ ...form, id_maquinas: 2 });
                  setModalMaquinasVisible(false);
                }}
                className={`w-[48%] p-3 rounded-xl border items-center ${
                  String(form.id_maquinas) === "2"
                    ? "bg-[#24ca85] border-[#24ca85]"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <Text
                  className={`font-bold text-xs text-center ${
                    String(form.id_maquinas) === "2"
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  DEERE-2
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setForm({ ...form, id_maquinas: 3 });
                  setModalMaquinasVisible(false);
                }}
                className={`w-[48%] p-3 rounded-xl border items-center ${
                  String(form.id_maquinas) === "3"
                    ? "bg-[#24ca85] border-[#24ca85]"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <Text
                  className={`font-bold text-xs text-center ${
                    String(form.id_maquinas) === "3"
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  FERGUSON-3
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setForm({ ...form, id_maquinas: 33 });
                  setModalMaquinasVisible(false);
                }}
                className={`w-[48%] p-3 rounded-xl border items-center ${
                  String(form.id_maquinas) === "33"
                    ? "bg-[#24ca85] border-[#24ca85]"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <Text
                  className={`font-bold text-xs text-center ${
                    String(form.id_maquinas) === "33"
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  TRATOR FEGUSON-33
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setForm({ ...form, id_maquinas: 34 });
                  setModalMaquinasVisible(false);
                }}
                className={`w-[48%] p-3 rounded-xl border items-center ${
                  String(form.id_maquinas) === "34"
                    ? "bg-[#24ca85] border-[#24ca85]"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <Text
                  className={`font-bold text-xs text-center ${
                    String(form.id_maquinas) === "34"
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  TRATOR HOLLAND-34
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setForm({ ...form, id_maquinas: 35 });
                  setModalMaquinasVisible(false);
                }}
                className={`w-[48%] p-3 rounded-xl border items-center ${
                  String(form.id_maquinas) === "35"
                    ? "bg-[#24ca85] border-[#24ca85]"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <Text
                  className={`font-bold text-xs text-center ${
                    String(form.id_maquinas) === "35"
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  TRATOR HGFGFD-35
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setForm({ ...form, id_maquinas: 36 });
                  setModalMaquinasVisible(false);
                }}
                className={`w-[48%] p-3 rounded-xl border items-center ${
                  String(form.id_maquinas) === "36"
                    ? "bg-[#24ca85] border-[#24ca85]"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <Text
                  className={`font-bold text-xs text-center ${
                    String(form.id_maquinas) === "36"
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  COLHETEIRA-36
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => setModalMaquinasVisible(false)}
              className="bg-gray-200 p-3 rounded-xl items-center"
            >
              <Text className="text-gray-700 font-bold">Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalMarcaVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalMarcaVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-lg">
            <Text className="text-lg font-bold text-gray-800 text-center mb-4">
              Selecione a Marca
            </Text>

            <Pressable
              onPress={() => {
                setForm({ ...form, marca_maquina: "Valtra" });
                setModalMarcaVisible(false);
              }}
              className={`w-full p-4 rounded-xl border items-center ${
                form.marca_maquina === "Valtra"
                  ? "bg-[#24ca85] border-[#24ca85]"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <Text
                className={`font-bold text-base ${
                  form.marca_maquina === "Valtra"
                    ? "text-white"
                    : "text-gray-800"
                }`}
              >
                Valtra
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setModalMarcaVisible(false)}
              className="bg-gray-200 p-3 rounded-xl items-center mt-4"
            >
              <Text className="text-gray-700 font-bold">Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;

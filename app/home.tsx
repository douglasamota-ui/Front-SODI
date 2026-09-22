import React, { useState, useCallback } from "react";
import { View, Text, TextInput, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useRouter, useFocusEffect } from "expo-router";
import ComponentsHome from "@/components/ComponentsHome/ComponentsHome";
import SeletorDeImagem from "@/components/SeletorDeImagem/SeletorDeImagem";
import * as ImagePicker from "expo-image-picker";
import api from "@/lib/axios.config";

export type Ordem = {
  id_ordem?: string | number;
  id_maquinas?: string | number;
  status: string;
  data_abertura?: string;
  descricao_problema?: string;
  marca?: string;
  nome_mecanico?: string;
  id_usuario?: string | number;
  status_ia?: string;
};

const Home = () => {
  const router = useRouter();

  const [mostrarForm, setMostrarForm] = useState<boolean>(false);
  const [busca, setBusca] = useState<string>("");
  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [clicouSalvar, setClicouSalvar] = useState<boolean>(false);

  const [imagem, setImagem] = useState<ImagePicker.ImagePickerAsset | null>(
    null,
  );

  const [form, setForm] = useState<Ordem>({
    id_maquinas: "",
    status: "",
    data_abertura: "",
    descricao_problema: "",
    marca: "",
    nome_mecanico: "",
    id_usuario: "",
    status_ia: "Pendente",
  });

  const isStatusValid = (form.status || "").length >= 1;
  const isDataAberturaValid = (form.data_abertura || "").length >= 4;
  const isDescricaoValid = (form.descricao_problema || "").length >= 5;
  const isMarcaValid = (form.marca || "").length >= 5;
  const isMecanicoValid = (form.nome_mecanico || "").length >= 5;

  const carregarOrdens = useCallback(async () => {
    try {
      const { data } = await api.get("/ordens_de_servico");
      if (Array.isArray(data)) {
        setOrdens(data);
      }
    } catch (error) {
      console.log("Erro ao buscar ordens:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarOrdens().finally(() => setCarregando(false));
    }, [carregarOrdens]),
  );

  function handleLogout() {
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    router.replace("/");
  }

  async function handleSalvar() {
    setClicouSalvar(true);

    if (
      !isStatusValid ||
      !isDataAberturaValid ||
      !isDescricaoValid ||
      !isMarcaValid ||
      !isMecanicoValid
    ) {
      alert("Aviso: Preencha todos os campos corretamente.");
      return;
    }

    const novaOrdem: Ordem = {
      id_maquinas: form.id_maquinas,
      status: form.status,
      data_abertura: form.data_abertura,
      descricao_problema: form.descricao_problema,
      marca: form.marca,
      nome_mecanico: form.nome_mecanico,
      id_usuario: Number(localStorage.getItem("id_user")),
      status_ia: form.status_ia,
    };

    console.log(novaOrdem);
    alert("");

    try {
      const resposta = await api.post("/ordensservico", novaOrdem);
      if (resposta.status === 201) {
        setOrdens((prev) => [novaOrdem, ...prev]);
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
        id_maquinas: "",
        status: "",
        data_abertura: "",
        descricao_problema: "",
        marca: "",
        nome_mecanico: "",
        id_usuario: "",
        status_ia: "Pendente",
      });
    }
  }

  const ordensFiltradas = (ordens || []).filter((ordem) => {
    const termo = busca.toLowerCase();
    const idMaq = ordem.id_maquinas || "";
    const desc = ordem.descricao_problema || "";
    const mec = ordem.nome_mecanico || "";

    return (
      ordem.status?.toLowerCase().includes(termo) ||
      ordem.marca?.toLowerCase().includes(termo) ||
      desc.toLowerCase().includes(termo) ||
      mec.toLowerCase().includes(termo) ||
      idMaq.toString().includes(termo)
    );
  });

  return (
    <SafeAreaView
      className="flex-1 bg-[#24ca85]"
      edges={["top", "left", "right"]}
    >
      <View className="bg-[#24ca85] pt-2 pb-4 px-4 flex-row items-center justify-between gap-3">
        <Image
          source={require("@/assets/image/sodi_logo_preto.jpg")}
          className="w-14 h-14 rounded-full"
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
          className="p-2 items-center justify-center bg-white/20 rounded-lg"
        >
          <Text className="text-white font-bold text-xs">Sair</Text>
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
                      <Text className="text-sm font-bold text-gray-700 mb-1">
                        Id Máquina
                      </Text>
                      <select
                        value={form.id_maquinas}
                        onChange={(e) =>
                          setForm({ ...form, id_maquinas: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-gray-800 text-[15px]"
                      >
                        <option value="">Selecione o ID da máquina...</option>
                        <option value="33">1</option>
                        <option value="34">2</option>
                        <option value="35">3</option>
                        <option value="36">4</option>
                        <option value="37">5</option>
                      </select>
                    </View>

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
                      placeholder="Descreva o problema..."
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

                    <ComponentsHome
                      label="Marca"
                      value={form.marca || ""}
                      setValue={(text) => setForm({ ...form, marca: text })}
                    />
                    {clicouSalvar && !isMarcaValid && (
                      <Text className="text-red-500 text-xs -mt-2 mb-2">
                        Marca inválida
                      </Text>
                    )}

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

export default Home;
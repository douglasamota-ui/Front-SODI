import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Platform, Alert } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import ComponentsHome from "@/components/ComponentsHome/ComponentsHome";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";

const API_URL = "http://192.168.1.30:3000";

export type Ordem = {
  idMaquina?: string;
  status: string;
  ano: string;
  descricao?: string;
  marca: string;
  mecanico?: string;
  imagem?: string;
};

const exibirAlerta = (titulo: string, mensagem: string) => {
  if (Platform.OS === "web") {
    alert(`${titulo}: ${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
};

const Home = () => {
  const router = useRouter();

  const [mostrarForm, setMostrarForm] = useState<boolean>(false);
  const [busca, setBusca] = useState<string>("");
  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [selectAberto, setSelectAberto] = useState<boolean>(false);

  const opçoesMaquinas = ["1", "2", "3", "4", "5", "10"];
  const [clicouSalvar, setClicouSalvar] = useState(false);

  const [form, setForm] = useState<Ordem>({
    idMaquina: "",
    status: "",
    ano: "",
    descricao: "",
    marca: "",
    mecanico: "",
    imagem: "",
  });

  const isStatusValid = form.status.length >= 1;
  const isAnoValid = form.ano.length >= 4;
  const isDescricaoValid = (form.descricao || "").length >= 5;
  const isMarcaValid = form.marca.length >= 5;
  const isMecanicoValid = (form.mecanico || "").length >= 5;

  async function carregarOrdens() {
    try {
      const response = await fetch(`${API_URL}/ordens_de_servico`);
      if (response.ok) {
        const data = await response.json();
        const ordensFormatadas: Ordem[] = data.map((item: any) => ({
          idMaquina: item.id_maquina ? String(item.id_maquina) : "",
          status: item.status || "",
          ano: item.ano ? String(item.ano) : "",
          descricao: item.descricao_problema || item.descricao || "",
          marca: item.marca || "",
          mecanico: item.nome_mecanico || item.mecanico || "",
          imagem: item.imagem || "",
        }));
        setOrdens(ordensFormatadas);
        return;
      }
    } catch (error) {
      console.log("Erro ao conectar com o servidor para buscar ordens:", error);
    }

    if (Platform.OS === "web") {
      try {
        const salvas = localStorage.getItem("ordens_salvas");
        if (salvas) setOrdens(JSON.parse(salvas));
      } catch (error) {
        console.log("Erro ao carregar do armazenamento local", error);
      }
    }
  }

  useEffect(() => {
    carregarOrdens();
  }, []);

  useEffect(() => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem("ordens_salvas", JSON.stringify(ordens));
      }
    } catch (error) {
      console.log("Erro ao guardar dados", error);
    }
  }, [ordens]);

  function handleLogout() {
    if (Platform.OS === "web") {
      localStorage.removeItem("id");
      localStorage.removeItem("email");
    }
    router.replace("/");
  }

  async function selecionarImagem() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      exibirAlerta(
        "Permissão necessária",
        "É necessário permitir o acesso à galeria para anexar fotos."
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.6,
      base64: true,
    });

    if (!resultado.canceled && resultado.assets[0]) {
      const asset = resultado.assets[0];
      const imagemFinal = asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : asset.uri;
      setForm({ ...form, imagem: imagemFinal });
    }
  }

  async function handleSalvar() {
    setClicouSalvar(true);

    if (
      !isStatusValid ||
      !isAnoValid ||
      !isDescricaoValid ||
      !isMarcaValid ||
      !isMecanicoValid
    ) {
      exibirAlerta("Aviso", "Preencha todos os campos corretamente.");
      return;
    }

    const dadosEnvio = {
      id_maquina: Number(form.idMaquina || 1),
      status: form.status,
      ano: form.ano,
      descricao_problema: form.descricao,
      marca: form.marca,
      nome_mecanico: form.mecanico,
      imagem: form.imagem,
    };

    try {
      const response = await fetch(`${API_URL}/cad_ordem_de_servico`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosEnvio),
      });

      if (response.status === 201 || response.ok) {
        exibirAlerta("Sucesso", "Ordem criada com sucesso!");
        await carregarOrdens();
      } else {
        exibirAlerta("Aviso", "Servidor retornou erro. Salvo localmente.");
        setOrdens([form, ...ordens]);
      }
    } catch (erro) {
      console.log("Erro na requisição:", erro);
      exibirAlerta("Aviso", "Servidor offline. Ordem salva localmente.");
      setOrdens([form, ...ordens]);
    } finally {
      setMostrarForm(false);
      setClicouSalvar(false);
      setSelectAberto(false);
      setForm({
        idMaquina: "",
        status: "",
        ano: "",
        descricao: "",
        marca: "",
        mecanico: "",
        imagem: "",
      });
    }
  }

  const ordensFiltradas = (ordens || []).filter((ordem) => {
    const termo = busca.toLowerCase();
    return (
      ordem.status?.toLowerCase().includes(termo) ||
      ordem.marca?.toLowerCase().includes(termo) ||
      ordem.descricao?.toLowerCase().includes(termo) ||
      ordem.idMaquina?.toString().includes(termo)
    );
  });

  return (
    <View className="flex-1 bg-white">
      <View className="bg-[#24ca85] pt-[50px] pb-4 px-4 flex-row items-center justify-between gap-3">
        <Image
          source={require("@/assets/image/sodi_logo_preto.jpg")}
          className="w-10 h-10"
          contentFit="contain"
        />

        <View className="flex-1 bg-white rounded-full px-4 justify-center h-10">
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar ordem..."
            placeholderTextColor="#6B7280"
            underlineColorAndroid="transparent"
            className="flex-1 text-sm text-black"
            style={Platform.OS === "web" && ({ outlineStyle: "none" } as any)}
          />
        </View>

        <Pressable onPress={handleLogout} className="p-2 items-center justify-center">
          <FontAwesome name="sign-out" size={22} color="#ffffff" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 p-4">
        {!mostrarForm ? (
          <Pressable
            onPress={() => setMostrarForm(true)}
            className="bg-[#24ca85] py-3 rounded-xl items-center mb-5"
          >
            <Text className="text-white font-bold text-base">Criar nova ordem</Text>
          </Pressable>
        ) : (
          <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-5">
            <Text className="text-lg font-bold text-gray-800 mb-3">Nova Ordem</Text>

            {/* Id Máquina */}
            <View className="mb-3">
              <Text className="text-sm font-bold text-gray-700 mb-1">Id Máquina</Text>
              <Pressable
                onPress={() => setSelectAberto(!selectAberto)}
                className="flex-row justify-between items-center border border-gray-300 rounded-xl px-4 py-3 bg-white"
              >
                <Text
                  className={`text-sm ${
                    form.idMaquina ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {form.idMaquina
                    ? `Máquina ${form.idMaquina}`
                    : "Selecione o ID da máquina..."}
                </Text>
                <FontAwesome
                  name={selectAberto ? "chevron-up" : "chevron-down"}
                  size={12}
                  color="#6B7280"
                />
              </Pressable>

              {selectAberto && (
                <View className="mt-1 border border-gray-200 rounded-xl bg-white overflow-hidden">
                  {opçoesMaquinas.map((item) => (
                    <Pressable
                      key={item}
                      className={`px-4 py-3 border-b border-gray-100 ${
                        form.idMaquina === item ? "bg-[#E6F7F0]" : ""
                      }`}
                      onPress={() => {
                        setForm({ ...form, idMaquina: item });
                        setSelectAberto(false);
                      }}
                    >
                      <Text
                        className={`text-sm ${
                          form.idMaquina === item
                            ? "text-[#24ca85] font-bold"
                            : "text-gray-700"
                        }`}
                      >
                        Máquina {item}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Status */}
            <ComponentsHome
              label="Status"
              placeholder="Ex: Aberta, Manutenção, Concluida"
              value={form.status}
              setValue={(text) => setForm({ ...form, status: text })}
            />
            {clicouSalvar && !isStatusValid && (
              <Text className="text-red-500 text-xs -mt-2 mb-2">Status inválido</Text>
            )}

            {/* Ano */}
            <ComponentsHome
              label="Ano"
              keyboardType="numeric"
              value={form.ano}
              setValue={(text) => setForm({ ...form, ano: text })}
            />
            {clicouSalvar && !isAnoValid && (
              <Text className="text-red-500 text-xs -mt-2 mb-2">
                Ano inválido (mínimo 4 dígitos)
              </Text>
            )}

            {/* Descrição */}
            <ComponentsHome
              label="Descrição"
              placeholder="Descreva o problema..."
              value={form.descricao || ""}
              setValue={(text) => setForm({ ...form, descricao: text })}
            />
            {clicouSalvar && !isDescricaoValid && (
              <Text className="text-red-500 text-xs -mt-2 mb-2">Descrição muito curta</Text>
            )}

            {/* Marca */}
            <ComponentsHome
              label="Marca"
              value={form.marca}
              setValue={(text) => setForm({ ...form, marca: text })}
            />
            {clicouSalvar && !isMarcaValid && (
              <Text className="text-red-500 text-xs -mt-2 mb-2">Marca inválida</Text>
            )}

            {/* Mecânico */}
            <ComponentsHome
              label="Mecânico"
              value={form.mecanico || ""}
              setValue={(text) => setForm({ ...form, mecanico: text })}
            />
            {clicouSalvar && !isMecanicoValid && (
              <Text className="text-red-500 text-xs -mt-2 mb-2">
                Nome do mecânico inválido
              </Text>
            )}

            {/* CAMPO DE IMAGEM DESTAÇADO */}
            <View className="mb-3">
              <Text className="text-sm font-bold text-gray-700 mb-1">
                Imagem do Problema
              </Text>

              <Pressable
                onPress={selecionarImagem}
                className="flex-row items-center justify-center gap-[10px] border-2 border-dashed border-[#24ca85] rounded-xl py-4 px-4 bg-[#F0FDF4] mt-1"
              >
                <FontAwesome name="camera" size={24} color="#24ca85" />
                <Text className="text-sm color-[#15803D] font-semibold">
                  {form.imagem ? "Alterar foto selecionada" : "Anexar foto da máquina"}
                </Text>
              </Pressable>

              {form.imagem ? (
                <View className="mt-[10px] relative">
                  <Image
                    source={{ uri: form.imagem }}
                    className="w-full h-40 rounded-xl"
                    contentFit="cover"
                  />
                  <Pressable
                    onPress={() => setForm({ ...form, imagem: "" })}
                    className="absolute top-2 right-2 bg-white rounded-xl"
                  >
                    <FontAwesome name="times-circle" size={24} color="#EF4444" />
                  </Pressable>
                </View>
              ) : null}
            </View>

            {/* Botões do Formulário */}
            <View className="flex-row justify-between gap-3 mt-3">
              <Pressable onPress={handleSalvar} className="flex-1 bg-[#24ca85] py-3 rounded-xl items-center">
                <Text className="text-white font-bold text-[15px]">Salvar</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setMostrarForm(false);
                  setClicouSalvar(false);
                  setSelectAberto(false);
                }}
                className="flex-1 bg-[#4A4A4A] py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold text-[15px]">Cancelar</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Lista de Ordens */}
        <View className="mt-2">
          {ordensFiltradas?.map((ordem, index) => (
            <View key={index} className="bg-white rounded-2xl p-4 mb-4 border border-gray-200">
              {ordem.imagem ? (
                <Image
                  source={{ uri: ordem.imagem }}
                  className="w-full h-40 rounded-xl mb-3"
                  contentFit="cover"
                />
              ) : null}
              <Text className="text-gray-800 text-sm my-[2px]">
                <Text className="font-bold">Máquina:</Text>{" "}
                {ordem.idMaquina || "N/A"}
              </Text>
              <Text className="text-gray-800 text-sm my-[2px]">
                <Text className="font-bold">Status:</Text> {ordem.status}
              </Text>
              <Text className="text-gray-800 text-sm my-[2px]">
                <Text className="font-bold">Ano:</Text> {ordem.ano}
              </Text>
              <Text className="text-gray-800 text-sm my-[2px]">
                <Text className="font-bold">Descrição:</Text> {ordem.descricao}
              </Text>
              <Text className="text-gray-800 text-sm my-[2px]">
                <Text className="font-bold">Marca:</Text> {ordem.marca}
              </Text>
              <Text className="text-gray-800 text-sm my-[2px]">
                <Text className="font-bold">Mecânico:</Text>{" "}
                {ordem.mecanico || "N/A"}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
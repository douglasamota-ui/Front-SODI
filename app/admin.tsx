import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

import api from "@/lib/axios.config";
import { removerUserId } from "@/lib/secureStore";

// Interface definida localmente sem depender do arquivo externo @/types/ordemServico
interface OrdemServico {
  id_ordem: number;
  nome_mecanico: string;
  data_abertura?: string;
  descricao_problema: string;
  status: string;
  id_maquinas: number;
  id_usuario: number;
  status_ia?: string;
  modelo_maquina?: string;
  marca_maquina?: string;
}

export default function AdminOrdensServicoPage() {
  const router = useRouter();

  // Estados da Lista
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  // Estados do Modal / Formulário
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState<number | null>(null);
  const [salvando, setSalvando] = useState(false);

  // Campos do Formulário
  const [nomeMecanico, setNomeMecanico] = useState("");
  const [descricaoProblema, setDescricaoProblema] = useState("");
  const [status, setStatus] = useState("Pendente");
  const [idMaquinas, setIdMaquinas] = useState("");
  const [idUsuario, setIdUsuario] = useState("");

  // 1. CARREGAR DADOS DO BACKEND
  const carregarOrdens = useCallback(() => {
    let ativo = true;
    setCarregando(true);

    const url = busca ? `/ordensservico?search=${busca}` : "/ordensservico";

    console.log(busca);
    api
      .get<OrdemServico[]>(url)
      .then(({ data }) => {
        if (ativo) setOrdens(data);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Erro", "Não foi possível carregar as ordens de serviço.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [busca]);

  useFocusEffect(carregarOrdens);

  // LOGOUT
  async function handleLogout() {
    await removerUserId();
    router.replace("/");
  }

  // 2. ABRIR FORMULÁRIO PARA CRIAR
  const abrirCriar = () => {
    setModoEdicao(false);
    setIdEdicao(null);
    setNomeMecanico("");
    setDescricaoProblema("");
    setStatus("Pendente");
    setIdMaquinas("");
    setIdUsuario("");
    setModalVisivel(true);
  };

  // 3. ABRIR FORMULÁRIO PARA EDITAR
  const abrirEditar = (item: OrdemServico) => {
    setModoEdicao(true);
    setIdEdicao(item.id_ordem);
    setNomeMecanico(item.nome_mecanico || "");
    setDescricaoProblema(item.descricao_problema || "");
    setStatus(item.status || "Pendente");
    setIdMaquinas(String(item.id_maquinas || ""));
    setIdUsuario(String(item.id_usuario || ""));
    setModalVisivel(true);
  };

  // 4. SALVAR (CRIAR OU EDITAR)
  const salvar = async () => {
    if (!nomeMecanico || !descricaoProblema || !idMaquinas || !idUsuario) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    setSalvando(true);

    const payload = {
      nome_mecanico: nomeMecanico,
      descricao_problema: descricaoProblema,
      status,
      id_maquinas: Number(idMaquinas),
      id_usuario: Number(idUsuario),
      status_ia: "Aguardando",
    };

    try {
      if (modoEdicao && idEdicao) {
        await api.put(`/editar/${idEdicao}`, payload);
      } else {
        await api.post("/ordensservico", payload);
      }

      setModalVisivel(false);
      carregarOrdens();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao salvar a ordem de serviço.");
    } finally {
      setSalvando(false);
    }
  };

  // 5. EXCLUIR
  const confirmarExclusao = (id_ordem: number) => {
    Alert.alert(
      "Excluir Ordem de Serviço",
      `Tem certeza que deseja excluir a OS #${id_ordem}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/deleta/${id_ordem}`);
              setOrdens((prev) =>
                prev.filter((item) => item.id_ordem !== id_ordem),
              );
            } catch (error) {
              Alert.alert("Erro", "Falha ao excluir a ordem de serviço.");
            }
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Cabeçalho */}
      <View className="flex-row justify-between items-center mb-4 pt-8">
        <View className="flex-row items-center gap-3">
          <Image
            source={require("@/assets/image/sodi_logo_preto.jpg")}
            style={{ width: 64, height: 48 }}
            contentFit="contain"
          />
          <Text className="text-2xl font-bold text-gray-800">Painel OS</Text>
        </View>

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className="bg-[#3C8670] px-4 py-2 rounded-lg"
            onPress={abrirCriar}
          >
            <Text className="text-white font-bold">+ Nova OS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="p-2 bg-gray-200 items-center justify-center rounded-lg"
          >
            <Ionicons name="log-out-outline" size={22} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Campo de Busca */}
      <TextInput
        className="bg-white p-3 rounded-lg border border-gray-300 mb-4"
        placeholder="Buscar por número da ordem..."
        value={busca}
        onChangeText={setBusca}
      />

      {/* Lista de OS */}
      {carregando ? (
        <ActivityIndicator className="flex-1" size="large" color="#3C8670" />
      ) : (
        <FlatList
          data={ordens}
          keyExtractor={(item) => String(item.id_ordem)}
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-lg mb-3 shadow-sm border border-gray-200">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-bold text-lg text-gray-900">
                  OS #{item.id_ordem} - {item.nome_mecanico}
                </Text>
                <Text className="px-2 py-1 text-xs font-bold rounded bg-yellow-100 text-yellow-800">
                  {item.status || "PENDENTE"}
                </Text>
              </View>

              {item.modelo_maquina && (
                <Text className="text-xs text-[#3C8670] font-semibold mb-1">
                  Máquina: {item.marca_maquina} {item.modelo_maquina}
                </Text>
              )}

              <Text className="text-gray-600 mb-3">
                {item.descricao_problema}
              </Text>

              {/* Botões de Ação */}
              <View className="flex-row justify-end gap-3 pt-2 border-t border-gray-100">
                <TouchableOpacity
                  className="bg-slate-700 px-3 py-2 rounded"
                  onPress={() => abrirEditar(item)}
                >
                  <Text className="text-white text-xs font-bold">Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-red-600 px-3 py-2 rounded"
                  onPress={() => confirmarExclusao(item.id_ordem)}
                >
                  <Text className="text-white text-xs font-bold">Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10">
              Nenhuma ordem de serviço encontrada.
            </Text>
          }
        />
      )}

      {/* Modal de Formulário */}
      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-2xl p-5 max-h-[90%]">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              {modoEdicao ? `Editar OS #${idEdicao}` : "Nova Ordem de Serviço"}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-3">
                <View>
                  <Text className="font-semibold text-gray-700 mb-1">
                    Mecânico *
                  </Text>
                  <TextInput
                    className="border border-gray-300 p-3 rounded-lg"
                    placeholder="Nome do mecânico"
                    value={nomeMecanico}
                    onChangeText={setNomeMecanico}
                  />
                </View>

                <View>
                  <Text className="font-semibold text-gray-700 mb-1">
                    ID da Máquina *
                  </Text>
                  <TextInput
                    className="border border-gray-300 p-3 rounded-lg"
                    placeholder="Ex: 1"
                    keyboardType="numeric"
                    value={idMaquinas}
                    onChangeText={setIdMaquinas}
                  />
                </View>

                <View>
                  <Text className="font-semibold text-gray-700 mb-1">
                    ID do Usuário *
                  </Text>
                  <TextInput
                    className="border border-gray-300 p-3 rounded-lg"
                    placeholder="Ex: 2"
                    keyboardType="numeric"
                    value={idUsuario}
                    onChangeText={setIdUsuario}
                  />
                </View>

                <View>
                  <Text className="font-semibold text-gray-700 mb-1">
                    Status
                  </Text>
                  <TextInput
                    className="border border-gray-300 p-3 rounded-lg"
                    value={status}
                    onChangeText={setStatus}
                  />
                </View>

                <View>
                  <Text className="font-semibold text-gray-700 mb-1">
                    Descrição do Problema *
                  </Text>
                  <TextInput
                    className="border border-gray-300 p-3 rounded-lg h-24"
                    placeholder="Descreva o problema observado..."
                    multiline
                    value={descricaoProblema}
                    onChangeText={setDescricaoProblema}
                  />
                </View>

                <View className="flex-row gap-3 my-4">
                  <TouchableOpacity
                    className="flex-1 bg-gray-300 p-4 rounded-lg items-center"
                    onPress={() => setModalVisivel(false)}
                  >
                    <Text className="font-bold text-gray-800">Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 bg-[#3C8670] p-4 rounded-lg items-center"
                    onPress={salvar}
                    disabled={salvando}
                  >
                    {salvando ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="text-white font-bold">
                        {modoEdicao ? "Atualizar" : "Cadastrar"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

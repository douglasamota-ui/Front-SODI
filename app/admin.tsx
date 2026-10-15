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
import { useRouter, useFocusEffect } from "expo-router";
import "@/global.css";
import api from "@/lib/axios.config";
import { obterUserId, removerUserId } from "@/lib/secureStore";

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
};

type Maquina = {
  id_maquinas: number;
  modelo_maquina: string;
  marca_maquina: string;
  ano_maquina: number;
  status: string;
};

const Administracao = () => {
  const router = useRouter();

  const [menuAberto, setMenuAberto] = useState(false);
  const [modalOrdem, setModalOrdem] = useState(false);
  const [modalMaquina, setModalMaquina] = useState(false);

  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [clicouSalvar, setClicouSalvar] = useState(false);

  const [maquinaId, setMaquinaId] = useState("");
  const [status, setStatus] = useState("");
  const [dataAbertura, setDataAbertura] = useState("");
  const [descricao, setDescricao] = useState("");
  const [marca, setMarca] = useState("");
  const [nomeMecanico, setNomeMecanico] = useState("");

  const [idMaquinaCadastro, setIdMaquinaCadastro] = useState("");
  const [modeloMaquina, setModeloMaquina] = useState("");
  const [marcaMaquina, setMarcaMaquina] = useState("");
  const [anoMaquina, setAnoMaquina] = useState("");
  const [statusMaquina, setStatusMaquina] = useState("");
  const [enviandoMaquina, setEnviandoMaquina] = useState(false);
  const [clicouSalvarMaquina, setClicouSalvarMaquina] = useState(false);

  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [abrirSelecao, setAbrirSelecao] = useState(false);

  const isStatusValid = status.trim().length >= 1;
  const isDataAberturaValid =
    /^\d{4}-\d{2}-\d{2}$/.test(dataAbertura.trim());
  const isDescricaoValid = descricao.trim().length >= 5;
  const isMarcaValid = marca.trim().length >= 5;
  const isMecanicoValid = nomeMecanico.trim().length >= 5;

  const isIdMaquinaValid =
    Number.isInteger(Number(idMaquinaCadastro)) &&
    Number(idMaquinaCadastro) > 0;

  const isModeloMaquinaValid = modeloMaquina.trim().length >= 1;
  const isMarcaMaquinaValid = marcaMaquina.trim().length >= 1;

  const isAnoMaquinaValid =
    Number.isInteger(Number(anoMaquina)) &&
    Number(anoMaquina) > 0;

  const isStatusMaquinaValid =
    statusMaquina.trim().length === 1;

  const buscarIdUsuario = async (): Promise<number | null> => {
    try {
      const idSalvo = await obterUserId();

      if (
        idSalvo !== null &&
        idSalvo !== undefined &&
        String(idSalvo).trim() !== ""
      ) {
        const id = Number(idSalvo);

        if (Number.isInteger(id) && id > 0) {
          return id;
        }
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar ID do usuário:", error);
      return null;
    }
  };

  const carregarOrdens = useCallback(async () => {
    try {
      const { data } = await api.get<Ordem[]>("/ordensservico");

      if (Array.isArray(data)) {
        setOrdens(data);
      }
    } catch (error) {
      console.error("Erro ao buscar ordens:", error);
    }
  }, []);

  const carregarMaquinas = useCallback(async () => {
    try {
      const { data } = await api.get<Maquina[]>("/maquinas");

      if (Array.isArray(data)) {
        setMaquinas(data);
      }
    } catch (error) {
      console.error("Erro ao buscar máquinas:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        carregarOrdens(),
        carregarMaquinas(),
      ])
        .catch((error) => {
          console.error(error);

          Alert.alert(
            "Erro",
            "Não foi possível carregar as ordens e máquinas."
          );
        })
        .finally(() => {
          setCarregando(false);
        });
    }, [carregarOrdens, carregarMaquinas])
  );

  const aoAtualizar = async () => {
    setAtualizando(true);

    try {
      await Promise.all([
        carregarOrdens(),
        carregarMaquinas(),
      ]);
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Erro",
        "Não foi possível atualizar as ordens e máquinas."
      );
    } finally {
      setAtualizando(false);
    }
  };

  const cancelarOrdem = () => {
    setMaquinaId("");
    setStatus("");
    setDataAbertura("");
    setDescricao("");
    setMarca("");
    setNomeMecanico("");
    setClicouSalvar(false);
    setAbrirSelecao(false);
    setModalOrdem(false);
  };

  const adicionarOrdem = async () => {
    setClicouSalvar(true);

    if (
      !maquinaId.trim() ||
      !isStatusValid ||
      !isDataAberturaValid ||
      !isDescricaoValid ||
      !isMarcaValid ||
      !isMecanicoValid
    ) {
      Alert.alert(
        "Aviso",
        "Preencha todos os campos corretamente."
      );

      return;
    }

    const userId = await buscarIdUsuario();

    if (!userId) {
      Alert.alert(
        "Erro",
        "O ID do usuário não foi encontrado. Faça login novamente."
      );

      return;
    }

    const novaOrdem = {
      id_maquinas: Number(maquinaId),
      status: status.trim(),
      data_abertura: dataAbertura.trim(),
      descricao_problema: descricao.trim(),
      marca: marca.trim(),
      nome_mecanico: nomeMecanico.trim(),
      id_usuario: userId,
      status_ia: "Pendente",
    };

    try {
      setEnviando(true);

      const { data } = await api.post<Ordem>(
        "/ordensservico",
        novaOrdem
      );

      if (data) {
        setOrdens((prev) => [data, ...prev]);
      } else {
        await carregarOrdens();
      }

      Alert.alert(
        "Sucesso",
        "Ordem de serviço cadastrada com sucesso!"
      );

      cancelarOrdem();
    } catch (error: any) {
      console.error("Erro ao salvar ordem:", error);

      const mensagemBackend =
        error?.response?.data?.message ||
        error?.response?.data?.erro ||
        error?.response?.data?.error;

      Alert.alert(
        "Erro",
        mensagemBackend ||
          "Falha ao salvar a ordem de serviço."
      );
    } finally {
      setEnviando(false);
    }
  };

  const cancelarMaquina = () => {
    setIdMaquinaCadastro("");
    setModeloMaquina("");
    setMarcaMaquina("");
    setAnoMaquina("");
    setStatusMaquina("");
    setClicouSalvarMaquina(false);
    setModalMaquina(false);
  };

  const adicionarMaquina = async () => {
    setClicouSalvarMaquina(true);

    if (
      !isIdMaquinaValid ||
      !isModeloMaquinaValid ||
      !isMarcaMaquinaValid ||
      !isAnoMaquinaValid ||
      !isStatusMaquinaValid
    ) {
      Alert.alert(
        "Aviso",
        "Preencha todos os campos da máquina corretamente."
      );

      return;
    }

    const novaMaquina = {
      id_maquinas: Number(idMaquinaCadastro),
      modelo_maquina: modeloMaquina.trim(),
      marca_maquina: marcaMaquina.trim(),
      ano_maquina: Number(anoMaquina),
      status: statusMaquina.trim(),
    };

    try {
      setEnviandoMaquina(true);

      const { data } = await api.post<Maquina>(
        "/maquinas",
        novaMaquina
      );

      setMaquinas((prev) => [data, ...prev]);

      Alert.alert(
        "Sucesso",
        "Máquina cadastrada com sucesso!"
      );

      cancelarMaquina();
    } catch (error: any) {
      console.error("Erro ao salvar máquina:", error);

      const mensagemBackend =
        error?.response?.data?.message ||
        error?.response?.data?.erro ||
        error?.response?.data?.error;

      Alert.alert(
        "Erro",
        mensagemBackend ||
          "Falha ao salvar a máquina."
      );
    } finally {
      setEnviandoMaquina(false);
    }
  };

  const handleLogout = async () => {
    try {
      await removerUserId();
    } catch (error) {
      console.error(
        "Erro ao remover usuário:",
        error
      );
    }

    router.replace("/");
  };

  const totalOrdens = ordens.length;

  const ordensAbertas = ordens.filter((o) => {
    const statusOrdem = o.status?.trim().toLowerCase();

    return (
      statusOrdem === "aberta" ||
      statusOrdem === "pendente"
    );
  }).length;

  const ordensManutencao = ordens.filter((o) => {
    const statusOrdem = o.status?.trim().toLowerCase();

    return (
      statusOrdem === "em manutenção" ||
      statusOrdem === "em manutencao"
    );
  }).length;

  const ordensConcluidas = ordens.filter((o) => {
    const statusOrdem = o.status?.trim().toLowerCase();

    return (
      statusOrdem === "concluída" ||
      statusOrdem === "concluida"
    );
  }).length;

  const mostrarSomenteData = (data: string) => {
    if (!data) {
      return "";
    }

    return String(data).substring(0, 10);
  };

  return (
    <View className="flex-1 bg-[#F5F7F6] pt-12">

      {/* HEADER */}
      <View className="w-full flex-row items-center justify-between bg-[#24ca85] px-4 py-3 shadow-sm">

        <Pressable
          onPress={() => setMenuAberto(!menuAberto)}
          className="p-2 active:opacity-70"
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

          {/* CARDS */}
          <View className="gap-4">

            <View className="rounded-2xl bg-[#24ca85] p-5 shadow-sm">
              <Text className="text-lg font-bold text-white">
                Ordens Cadastradas
              </Text>

              <Text className="mt-2 text-4xl font-extrabold text-white">
                {totalOrdens}
              </Text>

              <Text className="mt-1 text-sm text-white/80">
                Total de ordens no sistema
              </Text>
            </View>

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

            {/* ORDEM */}
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

            {/* MÁQUINA */}
            <View className="rounded-2xl bg-white p-5 shadow-sm">

              <Text className="text-xl font-bold text-[#202124]">
                Máquina
              </Text>

              <Text className="mt-1 text-sm text-[#73777A]">
                Cadastre uma nova máquina.
              </Text>

              <Pressable
                onPress={() => setModalMaquina(true)}
                className="mt-5 rounded-xl bg-[#24ca85] py-3.5 active:opacity-90"
              >
                <Text className="text-center text-base font-bold text-white">
                  + Adicionar Máquina
                </Text>
              </Pressable>

            </View>

          </View>

          {/* MÁQUINAS */}
          {!carregando && maquinas.length > 0 && (
            <View className="mt-8">

              <Text className="mb-4 text-2xl font-bold text-[#202124]">
                Máquinas cadastradas
              </Text>

              <FlatList
                data={maquinas}
                keyExtractor={(item) =>
                  String(item.id_maquinas)
                }
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View className="mb-3 rounded-2xl bg-white p-4 shadow-sm">

                    <Text className="text-lg font-bold text-[#202124]">
                      Máquina #{item.id_maquinas}
                    </Text>

                    <Text className="mt-2 text-sm text-[#73777A]">
                      Modelo: {item.modelo_maquina}
                    </Text>

                    <Text className="mt-1 text-sm text-[#73777A]">
                      Marca: {item.marca_maquina}
                    </Text>

                    <Text className="mt-1 text-sm text-[#73777A]">
                      Ano: {item.ano_maquina}
                    </Text>

                    <Text className="mt-1 text-sm text-[#73777A]">
                      Status: {item.status}
                    </Text>

                  </View>
                )}
              />

            </View>
          )}

          {/* ORDENS */}
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
                  keyExtractor={(item) =>
                    String(item.id_ordem)
                  }
                  scrollEnabled={false}
                  renderItem={({ item: ordem }) => (
                    <View className="mb-3 rounded-2xl bg-white p-4 shadow-sm">

                      <Text className="text-lg font-bold text-[#202124]">
                        Ordem #{ordem.id_ordem}
                      </Text>

                      <Text className="mt-3 text-sm text-[#3F4442]">
                        <Text className="font-bold">
                          Máquina:
                        </Text>{" "}
                        {ordem.id_maquinas || "N/A"}
                      </Text>

                      <Text className="mt-1 text-sm text-[#3F4442]">
                        <Text className="font-bold">
                          Status:
                        </Text>{" "}
                        {ordem.status}
                      </Text>

                      {ordem.data_abertura && (
                        <Text className="mt-1 text-sm text-[#3F4442]">
                          <Text className="font-bold">
                            Data Abertura:
                          </Text>{" "}
                          {mostrarSomenteData(
                            ordem.data_abertura
                          )}
                        </Text>
                      )}

                      <Text className="mt-1 text-sm text-[#3F4442]">
                        <Text className="font-bold">
                          Descrição:
                        </Text>{" "}
                        {ordem.descricao_problema || "N/A"}
                      </Text>

                      <Text className="mt-1 text-sm text-[#3F4442]">
                        <Text className="font-bold">
                          Marca:
                        </Text>{" "}
                        {ordem.marca || "N/A"}
                      </Text>

                      <Text className="mt-1 text-sm text-[#3F4442]">
                        <Text className="font-bold">
                          Mecânico:
                        </Text>{" "}
                        {ordem.nome_mecanico || "N/A"}
                      </Text>

                      {ordem.status_ia && (
                        <Text className="mt-1 text-sm text-[#3F4442]">
                          <Text className="font-bold">
                            Status IA:
                          </Text>{" "}
                          {ordem.status_ia}
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

      {/* MODAL MÁQUINA */}
      {modalMaquina && (
        <View className="absolute inset-0 z-50 bg-black/50">

          <ScrollView
            className="flex-1 px-5"
            contentContainerStyle={{
              paddingVertical: 20,
              justifyContent: "center",
            }}
            showsVerticalScrollIndicator={false}
          >

            <View className="my-auto w-full rounded-3xl bg-white p-6">

              <Text className="text-2xl font-bold text-[#202124]">
                Nova Máquina
              </Text>

              <Text className="mt-4 mb-1 text-base font-bold text-[#3F4442]">
                ID da Máquina
              </Text>

              <TextInput
                value={idMaquinaCadastro}
                onChangeText={setIdMaquinaCadastro}
                placeholder="Digite o ID da máquina..."
                placeholderTextColor="#73777A"
                keyboardType="numeric"
                className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base text-[#202124]"
              />

              {clicouSalvarMaquina &&
                !isIdMaquinaValid && (
                  <Text className="mt-1 text-xs text-red-500">
                    ID da máquina inválido
                  </Text>
                )}

              <Text className="mt-4 mb-1 text-base font-bold text-[#3F4442]">
                Modelo da Máquina
              </Text>

              <TextInput
                value={modeloMaquina}
                onChangeText={setModeloMaquina}
                placeholder="Digite o modelo..."
                placeholderTextColor="#73777A"
                maxLength={150}
                className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base text-[#202124]"
              />

              {clicouSalvarMaquina &&
                !isModeloMaquinaValid && (
                  <Text className="mt-1 text-xs text-red-500">
                    Modelo inválido
                  </Text>
                )}

              <Text className="mt-4 mb-1 text-base font-bold text-[#3F4442]">
                Marca da Máquina
              </Text>

              <TextInput
                value={marcaMaquina}
                onChangeText={setMarcaMaquina}
                placeholder="Digite a marca..."
                placeholderTextColor="#73777A"
                maxLength={150}
                className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base text-[#202124]"
              />

              {clicouSalvarMaquina &&
                !isMarcaMaquinaValid && (
                  <Text className="mt-1 text-xs text-red-500">
                    Marca inválida
                  </Text>
                )}

              <Text className="mt-4 mb-1 text-base font-bold text-[#3F4442]">
                Ano da Máquina
              </Text>

              <TextInput
                value={anoMaquina}
                onChangeText={setAnoMaquina}
                placeholder="Digite o ano..."
                placeholderTextColor="#73777A"
                keyboardType="numeric"
                maxLength={4}
                className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base text-[#202124]"
              />

              {clicouSalvarMaquina &&
                !isAnoMaquinaValid && (
                  <Text className="mt-1 text-xs text-red-500">
                    Ano inválido
                  </Text>
                )}

              <Text className="mt-4 mb-1 text-base font-bold text-[#3F4442]">
                Status
              </Text>

              <TextInput
                value={statusMaquina}
                onChangeText={(texto) =>
                  setStatusMaquina(texto.slice(0, 1))
                }
                placeholder="Ex: A"
                placeholderTextColor="#73777A"
                maxLength={1}
                className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base text-[#202124]"
              />

              {clicouSalvarMaquina &&
                !isStatusMaquinaValid && (
                  <Text className="mt-1 text-xs text-red-500">
                    O status deve ter 1 caractere
                  </Text>
                )}

              <View className="mt-6 flex-row gap-3">

                <Pressable
                  onPress={adicionarMaquina}
                  disabled={enviandoMaquina}
                  className="flex-1 items-center rounded-xl bg-[#24ca85] py-3.5 active:opacity-90"
                >
                  {enviandoMaquina ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-center font-bold text-white">
                      Salvar
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={cancelarMaquina}
                  disabled={enviandoMaquina}
                  className="flex-1 items-center rounded-xl bg-[#4A4A4A] py-3.5 active:opacity-90"
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

      {/* MODAL ORDEM */}
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

            <View className="my-auto w-full rounded-3xl bg-white p-6">

              <Text className="text-2xl font-bold text-[#202124]">
                Nova Ordem
              </Text>

              {/* ID MÁQUINA */}
              <Text className="mt-4 mb-1 text-base font-bold text-[#3F4442]">
                Id Máquina
              </Text>

              <Pressable
                onPress={() =>
                  setAbrirSelecao(!abrirSelecao)
                }
                className="w-full flex-row items-center justify-between rounded-xl border border-[#DDE5E0] bg-white px-4 py-3"
              >
                <Text
                  className={
                    maquinaId
                      ? "text-base text-[#202124]"
                      : "text-base text-[#73777A]"
                  }
                >
                  {maquinaId
                    ? maquinaId
                    : "Selecione o ID da máquina..."}
                </Text>

                <Text className="text-xs text-[#73777A]">
                  ▼
                </Text>
              </Pressable>

              {abrirSelecao && (
                <View className="mt-1 overflow-hidden rounded-xl border border-[#DDE5E0] bg-white">

                  <FlatList
                    data={maquinas}
                    keyExtractor={(item, index) =>
                      String(
                        item.id_maquinas ?? index
                      )
                    }
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <Pressable
                        className="border-b border-gray-100 px-4 py-3 active:bg-gray-100"
                        onPress={() => {
                          setMaquinaId(
                            String(item.id_maquinas)
                          );
                          setAbrirSelecao(false);
                        }}
                      >
                        <Text className="text-base text-[#202124]">
                          {item.id_maquinas}
                        </Text>
                      </Pressable>
                    )}
                  />

                </View>
              )}

              {/* STATUS */}
              <Text className="mt-4 mb-1 text-base font-bold text-[#3F4442]">
                Status
              </Text>

              <TextInput
                value={status}
                onChangeText={setStatus}
                placeholder="Ex: Aberta, Manutenção, Concluida"
                placeholderTextColor="#73777A"
                className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base text-[#202124]"
              />

              {clicouSalvar && !isStatusValid && (
                <Text className="mt-1 text-xs text-red-500">
                  Status inválido
                </Text>
              )}

              {/* DATA */}
              <Text className="mt-4 mb-1 text-base font-bold text-[#3F4442]">
                Data de Abertura
              </Text>

              <TextInput
                value={dataAbertura}
                onChangeText={setDataAbertura}
                placeholder="AAAA-MM-DD"
                placeholderTextColor="#73777A"
                keyboardType="numeric"
                maxLength={10}
                className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base text-[#202124]"
              />

              {clicouSalvar &&
                !isDataAberturaValid && (
                  <Text className="mt-1 text-xs text-red-500">
                    Data de abertura inválida
                  </Text>
                )}

              {/* DESCRIÇÃO */}
              <Text className="mt-4 mb-1 text-base font-bold text-[#3F4442]">
                Descrição do Problema
              </Text>

              <TextInput
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Descreva o problema..."
                placeholderTextColor="#73777A"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base text-[#202124]"
                style={styles.textArea}
              />

              {clicouSalvar &&
                !isDescricaoValid && (
                  <Text className="mt-1 text-xs text-red-500">
                    Descrição muito curta
                  </Text>
                )}

              {/* MARCA */}
              <Text className="mt-4 mb-1 text-base font-bold text-[#3F4442]">
                Marca
              </Text>

              <TextInput
                value={marca}
                onChangeText={setMarca}
                placeholder="Digite a marca..."
                placeholderTextColor="#73777A"
                className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base text-[#202124]"
              />

              {clicouSalvar && !isMarcaValid && (
                <Text className="mt-1 text-xs text-red-500">
                  Marca inválida
                </Text>
              )}

              {/* MECÂNICO */}
              <Text className="mt-4 mb-1 text-base font-bold text-[#3F4442]">
                Nome do Mecânico
              </Text>

              <TextInput
                value={nomeMecanico}
                onChangeText={setNomeMecanico}
                placeholder="Digite o nome do mecânico..."
                placeholderTextColor="#73777A"
                className="rounded-xl border border-[#DDE5E0] px-4 py-3 text-base text-[#202124]"
              />

              {clicouSalvar &&
                !isMecanicoValid && (
                  <Text className="mt-1 text-xs text-red-500">
                    Nome do mecânico inválido
                  </Text>
                )}

              {/* BOTÕES */}
              <View className="mt-6 flex-row gap-3">

                <Pressable
                  onPress={adicionarOrdem}
                  disabled={enviando}
                  className="flex-1 items-center rounded-xl bg-[#24ca85] py-3.5 active:opacity-90"
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
                  className="flex-1 items-center rounded-xl bg-[#4A4A4A] py-3.5 active:opacity-90"
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
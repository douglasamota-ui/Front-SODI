import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import SeletorDeImagem from "@/components/SeletorDeImagem/SeletorDeImagem";
import CampoDeTexto from "@/components/CampodeTexto/CampodeTexto";
import Botao from "@/components/botao/botao";
import api from "@/lib/axios.config";
import { obterUserId } from "@/lib/secureStore";

const NewPost = () => {
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [imagem, setImagem] = useState<ImagePicker.ImagePickerAsset | null>(
    null
  );

  const [isTituloError, setIsTituloError] = useState<boolean>(false);
  const [isTextoError, setIsTextoError] = useState<boolean>(false);
  const [isImagemError, setIsImagemError] = useState<boolean>(false);

  const [enviando, setEnviando] = useState(false);

  const criarPostagem = async () => {
    const tituloInvalido = !titulo;
    const textoInvalido = !texto;
    const imagemInvalida = !imagem;

    setIsTituloError(tituloInvalido);
    setIsTextoError(textoInvalido);
    setIsImagemError(imagemInvalida);

    if (tituloInvalido || textoInvalido || imagemInvalida) return;

    const userId = await obterUserId();

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("texto", texto);
    if (userId) formData.append("usuarioId", userId);
    formData.append("imagem", {
      uri: imagem.uri,
      name: imagem.fileName ?? "imagem.jpg",
      type: imagem.mimeType ?? "image/jpeg",
    } as unknown as Blob);

    try {
      setEnviando(true);
      await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitulo("");
      setTexto("");
      setImagem(null);
      Alert.alert("Sucesso", "Postagem criada com sucesso");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a postagem");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <View>
        <Text>Crie uma nova postagem</Text>
      </View>
      <View>
        <CampoDeTexto
          label="Titulo"
          value={titulo}
          isError={isTituloError}
          setValue={setTitulo}
          errorMessage="Titulo inválido"
          placeholder="De um titulo para a postagem"
        />
        <CampoDeTexto
          label="Texto"
          value={texto}
          isError={isTextoError}
          setValue={setTexto}
          errorMessage="Texto inválido"
          placeholder="Texto da postagem"
          multiline={true}
          numberOfLines={10}
          textAlignVertical="top"
          textInputClassName="h-60"
        />
        <SeletorDeImagem
          label="Imagem"
          value={imagem}
          setValue={setImagem}
          isError={isImagemError}
          errorMessage="Selecione uma imagem"
        />
      </View>
      <Botao className="mt-4" onPress={criarPostagem} disabled={enviando}>
        <Text className="text-white text-center font-bold">
          {enviando ? "Enviando..." : "Criar postagem"}
        </Text>
      </Botao>
    </View>
  );
};

export default NewPost;
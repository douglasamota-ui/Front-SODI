import { cn } from "@/lib/cn";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const LADO_MAXIMO = 250;
const QUALIDADE_COMPRESSAO = 0.6;

const comprimirImagem = async (
  ativo: ImagePicker.ImagePickerAsset,
): Promise<ImagePicker.ImagePickerAsset> => {
  try {
    let contexto = ImageManipulator.manipulate(ativo.uri);

    const maiorLado = Math.max(ativo.width, ativo.height);
    if (maiorLado > LADO_MAXIMO) {
      const larguraEhMaior = ativo.width >= ativo.height;
      contexto = contexto.resize(
        larguraEhMaior ? { width: LADO_MAXIMO } : { height: LADO_MAXIMO },
      );
    }

    const imagemRenderizada = await contexto.renderAsync();
    const resultado = await imagemRenderizada.saveAsync({
      format: SaveFormat.JPEG,
      compress: QUALIDADE_COMPRESSAO,
    });

    return {
      ...ativo,
      uri: resultado.uri,
      width: resultado.width,
      height: resultado.height,
      mimeType: "image/jpeg",
      fileName: ativo.fileName ?? "imagem.jpg",
      fileSize: undefined,
    };
  } catch {
    return ativo;
  }
};

type SeletorDeImagemProps = {
  label: string;
  value: ImagePicker.ImagePickerAsset | null;
  setValue: React.Dispatch<
    React.SetStateAction<ImagePicker.ImagePickerAsset | null>
  >;
  errorMessage?: string;
  isError: boolean;
  viewClassName?: string;
  labelClassName?: string;
  touchableClassName?: string;
};

const SeletorDeImagem = ({
  label,
  value,
  setValue,
  errorMessage = "",
  isError,
  viewClassName = "",
  labelClassName = "",
  touchableClassName = "",
}: SeletorDeImagemProps) => {
  const escolherDaGaleria = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) return;

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!resultado.canceled) {
      setValue(await comprimirImagem(resultado.assets[0]));
    }
  };

  const tirarFoto = async () => {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) return;

    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!resultado.canceled) {
      setValue(await comprimirImagem(resultado.assets[0]));
    }
  };

  return (
    <View className={cn("gap-1", viewClassName)}>
      <Text className={cn("text-black text-xl", labelClassName)}>{label}</Text>
      <TouchableOpacity
        onPress={escolherDaGaleria}
        className={cn(
          "bg-white w-72 h-40 rounded-xl items-center justify-center overflow-hidden",
          touchableClassName,
        )}
      >
        {value ? (
          <Image
            source={{ uri: value.uri }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        ) : (
          <Text className="text-gray-400 text-lg">Selecionar imagem</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={tirarFoto}
        className="flex-row items-center gap-2 self-start"
      >
        <Ionicons name="camera" size={18} color="#4b5563" />
        <Text className="text-gray-600">Tirar foto</Text>
      </TouchableOpacity>
      {isError ? (
        <Text className="text-red-600 mt-2">{errorMessage}</Text>
      ) : null}
    </View>
  );
};

export default SeletorDeImagem;


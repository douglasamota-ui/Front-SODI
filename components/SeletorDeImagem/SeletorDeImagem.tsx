import { cn } from "@/lib/cn";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
      setValue(resultado.assets[0]);
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
      setValue(resultado.assets[0]);
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
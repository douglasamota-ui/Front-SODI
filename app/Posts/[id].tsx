import { Postagem } from "@/components/CartaoDePostagem/CartaoDePostagem";
import api from "@/lib/axios.config";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
const PostDetailsPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [postagem, setPostagem] = useState<Postagem | null>(null);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      api
        .get<Postagem>(`/posts/${id}`)
        .then(({ data }) => {
          if (ativo) setPostagem(data);
        })
        .finally(() => {
          if (ativo) setCarregando(false);
        });

      return () => {
        ativo = false;
      };
    }, [id]),
  );

  if (carregando || !postagem) {
    return <ActivityIndicator className="flex-1" size="large" />;
  }

  const imagemUri = `${api.defaults.baseURL}/posts/${postagem.id}/imagem`;

  return (
    <View className="flex-1 gap-20">
      <Image
        source={{ uri: imagemUri }}
        style={{ width: "100%", height: 300 }}
        contentFit="cover"
      />
      <View className="p-4 gap-1">
        <Text className="text-black text-xl font-bold">{postagem.titulo}</Text>
        <Text className="text-black text-xl font-bold">{postagem.texto}</Text>
      </View>
    </View>
  );
};

export default PostDetailsPage;
import api from "@/lib/axios.config";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export type Postagem = {
  id: number;
  titulo: string;
  texto: string;
};

type PostagemCard = Omit<Postagem, "texto">;

type CartaoDePostagemProps = {
  postagem: PostagemCard;
};

const CartaoDePostagem = ({ postagem }: CartaoDePostagemProps) => {
  const router = useRouter();
  const imagemUri = `${api.defaults.baseURL}/posts/${postagem.id}/imagem`;

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/posts/[id]" as any,
          params: {
            id: String(postagem.id),
          },
        });
      }}
    >
      <View className="bg-white rounded-xl overflow-hidden">
        <Image
          source={{ uri: imagemUri }}
          style={{ width: "100%", height: 200 }}
          contentFit="cover"
        />
        <View className="p-4 gap-1">
          <Text className="text-black text-xl font-bold">
            {postagem.titulo}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default CartaoDePostagem;
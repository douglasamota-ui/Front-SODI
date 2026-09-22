import * as SecureStore from "expo-secure-store";

const CHAVE_USER_ID = "user_id";

export const salvarUserId = async (userId: string) => {
  await SecureStore.setItemAsync(CHAVE_USER_ID, userId);
};

export const obterUserId = async () => {
  return await SecureStore.getItemAsync(CHAVE_USER_ID);
};

export const removerUserId = async () => {
  await SecureStore.deleteItemAsync(CHAVE_USER_ID);
};
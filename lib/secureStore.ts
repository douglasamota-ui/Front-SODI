import * as SecureStore from "expo-secure-store";

const CHAVE_USER_ID = "userId";

export const salvarUserId = async (userId: string | number) => {
  await SecureStore.setItemAsync(CHAVE_USER_ID, String(userId));
};

export const obterUserId = async () => {
  return await SecureStore.getItemAsync(CHAVE_USER_ID);
};
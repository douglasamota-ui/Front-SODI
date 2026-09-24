import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const CHAVE_USER_ID = 'user_id';

export const obterUserId = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return typeof window !== 'undefined' ? localStorage.getItem(CHAVE_USER_ID) : null;
    }
    return await SecureStore.getItemAsync(CHAVE_USER_ID);
  } catch (error) {
    console.error("Erro ao obter userId:", error);
    return null;
  }
};

export const removerUserId = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CHAVE_USER_ID);
      }
      return;
    }
    await SecureStore.deleteItemAsync(CHAVE_USER_ID);
  } catch (error) {
    console.error("Erro ao remover userId:", error);
  }
};

export const salvarUserId = async (id: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CHAVE_USER_ID, id);
      }
      return;
    }
    await SecureStore.setItemAsync(CHAVE_USER_ID, id);
  } catch (error) {
    console.error("Erro ao salvar userId:", error);
  }
};
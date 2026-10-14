import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";
import type { AboutContent } from "../constants/about";

const CACHE_KEY = "about:content";

// Última versão publicada que o aparelho já recebeu (para abrir sem internet).
export async function getCachedAbout(): Promise<AboutContent | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as AboutContent) : null;
  } catch {
    return null;
  }
}

export async function fetchAbout(): Promise<AboutContent> {
  const { data } = await api.get<AboutContent>("/about");
  AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data)).catch(() => {});
  return data;
}

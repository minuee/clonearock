//import * as StorageService from './storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
const STORAGE_KEY = '@Storage/Wallet';
export async function loadWalletPKs() {
    const pks = await AsyncStorage.getItem(STORAGE_KEY);
    return pks ? JSON.parse(pks) : [];
}

export async function saveWalletPKs(wallets) {
    const map = wallets.map(({ description, name, privateKey }) => ({ description, name, privateKey }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function deleteWalletPKs() {
    return AsyncStorage.deleteItem(STORAGE_KEY);
}
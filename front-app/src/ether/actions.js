//import { Wallet as WalletUtils } from '@common/utils';
import * as ethers from 'ethers'; //5.6

import { Wallets as WalletsService } from './Service';

export async function addWallet(walletName, wallet, walletDescription = '') {
    //WalletsStore.isLoading(true);
    //WalletsStore.addWallet(walletName, wallet, walletDescription);
    //WalletsStore.isLoading(false);
}

export async function loadWallets() {
    //WalletsStore.isLoading(true);
    const pks = await WalletsService.loadWalletPKs();
    pks.map(({ description, name, privateKey }) => {
        const wallet = ethers.utils.loadWalletFromPrivateKey(privateKey);
        //WalletsStore.addWallet(name, wallet, description);
    });
    //WalletsStore.isLoading(false);
}

export async function updateBalance(wallet) {
    //const balance = await wallet.getBalance();
    //WalletsStore.setBalance(wallet.getAddress(), balance);
}

export async function removeWallet(wallet) {
    //WalletsStore.removeWallet(wallet);
}

export async function saveWallets() {
    //await WalletsService.saveWalletPKs(WalletsStore.list);
}

export async function selectWallet(wallet) {
    //WalletStore.select(wallet);
}
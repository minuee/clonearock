
import * as ethers from 'ethers'; //5.6

const network = 'rinkeby';//(process.env.NODE_ENV === 'production') ? 'mainnet' : 'rinkeby';
const PROVIDER = ethers.providers.getDefaultProvider(network);

class Util {
    generateMnemonics = (byte = 16 , langSet = 'en') => {
        /*
        byte 16 12char
        byte 20 15char
        byte 24 18char
        byte 28 21char
        byte 32 24char
        */
        let aRandomB = ethers.utils.randomBytes(byte);
        //console.log("aaaaaaa : ", aRandomB);
        return ethers.utils.entropyToMnemonic(aRandomB,langSet);//.split(' ');
    }
    generateMnemonicsSplit = (byte = 16 , langSet = 'en') => {
        /*
        byte 16 12char
        byte 20 15char
        byte 24 18char
        byte 28 21char
        byte 32 24char
        */
        let aRandomB = ethers.utils.randomBytes(byte);
        //console.log("aaaaaaa : ", aRandomB);

        const data = ethers.utils.entropyToMnemonic(aRandomB,langSet);
        if ( langSet === 'ja') {
            //일본어는 공백구분값을 따로 지정
            return {
                originData : data,
                splitData : data.split('　')
            }
        }else{
            return {
                originData : data,
                splitData : data.split(' ')
            }
        }
    }
    loadWalletFromMnemonics = (mnemonics,langSet,cutom_path = "m/44'/60'/0'/0/0") =>  {        
        if (!(mnemonics instanceof Array) && typeof mnemonics !== 'string')
            throw new Error('invalid mnemonic');
        else if (mnemonics instanceof Array)
            mnemonics = mnemonics.join(' ');
        try {
            const wallet = ethers.Wallet.fromMnemonic(mnemonics,cutom_path,langSet);
            wallet.provider = PROVIDER;
            return wallet;
        }catch(e) {
            console.log('eeee',e)
        }        
    }
}

const etherUtil = new Util();
export default etherUtil;
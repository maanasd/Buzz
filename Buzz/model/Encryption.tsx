import Aes from 'react-native-aes-crypto';
import EncryptedStorage from 'react-native-encrypted-storage';

class Encryption {
    static generateKey(password: string, salt: string, cost: number, length: number) {
        return Aes.pbkdf2(password, salt, cost, length)
    }

    static storeKey(key: string) {
        EncryptedStorage.setItem('aesKey', key)
            .then(() => {
                console.log('AES key stored');
            })
            .catch((err) => {
                console.log(err);
            });
    }
    static async getKey() {
        try {
            const key_1 = await EncryptedStorage.getItem('aesKey');
            return key_1;
        } catch (err) {
            console.log(err);
        }
    }

    static async encryptData(text: string, key: string) {
        return Aes.randomKey(16).then(async iv => {
            const cipher = await Aes.encrypt(text, key, iv, 'aes-256-cbc');
            return ({
                cipher,
                iv,
            });
        })
    }

    static async decryptData(encryptedData: { cipher: any; iv: any }, key: string) {
        return await Aes.decrypt(encryptedData.cipher, key, encryptedData.iv, 'aes-256-cbc')
    }

}

export default Encryption;
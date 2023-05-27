import EncryptedStorage from 'react-native-encrypted-storage';
import md5 from 'md5';
import zxcvbn from 'zxcvbn';

// Create database to hash and store master key
class MasterKey {
    static estimateMasterKeyStrength(masterKey: string): number {
        const strength = zxcvbn(masterKey);
        return strength.score;
    }
    static async storeMasterKey(masterKey: string) {
        const hashString: string = md5(masterKey);
        EncryptedStorage.setItem('masterKey', hashString)
            .then(() => {
                console.log('Master key stored');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static async getMasterKey(): Promise<string|void|null> {
        try {
            const masterKey = await EncryptedStorage.getItem('masterKey');
            return masterKey;
        } catch (err) {
            console.log(err);
        }
    }
}

export default MasterKey;

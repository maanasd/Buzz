import React from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import md5 from 'md5';


// Create database to hash and store master key
class MasterKey {
    static storeMasterKey(masterKey: string) {
        const hashString: string = md5(masterKey);
        EncryptedStorage.setItem('masterKey', hashString)
            .then(() => {
                console.log('Master key stored');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static getMasterKey(): Promise<string|void|null> {
        return EncryptedStorage.getItem('masterKey')
            .then((masterKey) => {
                return masterKey;
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

export default MasterKey;

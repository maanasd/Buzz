// Create settings component using react-native-paper
import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { TextInput, Button, ProgressBar, MD3Colors } from 'react-native-paper';
import customTheme from '../buzzTheme';
import BackgroundFetch from "react-native-background-fetch";
import Encryption from '../model/Encryption';
import DatabaseHandler from '../model/Credential';
import Notification from './Notification';
import md5 from 'md5';
import MasterKey from '../model/MasterKey';
function sleep(ms: number) {
    return new Promise((resolve: any) => setTimeout(resolve, ms));
  }
function Settings() {
    const [masterKey, setMasterKey] = React.useState('');
    const [showProgress, setShowProgress] = React.useState(false);
    const [progressValue, setProgressValue] = React.useState(0);
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const db = new DatabaseHandler();
    function handleMasterKeyUpdate() {
        if (masterKey === '')
            return;
        setShowProgress(true);
        // Do your background work...

        Encryption.getKey().then((key) => {
            db.getAllData(async (data: any) => {
                const total: number = data.length;
                let index = 0;
                Encryption.generateKey(masterKey, md5(masterKey), 1000, 256).then(async (aesKey) => {
                    await (async () => {
                        for (const d of data){
                            const reencrypted = JSON.stringify(await Encryption.encryptData(d.password, aesKey));
                            db.updateData(d.id, d.url, d.username, reencrypted, ()=>{
                                setProgressValue((index + 1) / total);
                                index += 1;
                            });
                        }
                        await MasterKey.storeMasterKey(masterKey);
                        Encryption.storeKey(aesKey);
                    })()
                    await sleep(500);
                    setShowProgress(false);

                });
                
            }, key!);
        });
    }
    return (
        <>
            <View style={styles.updateContainer}>
                <TextInput value={masterKey} onChangeText={setMasterKey} placeholder='Enter Master Key' label="Master Key" secureTextEntry={true} />
                <Button style={styles.loginBtn} mode='contained' onPress={() => handleMasterKeyUpdate()}>Update Master Key</Button>

            </View>
            <Modal presentationStyle='overFullScreen' style={{ alignContent: 'center' }} visible={showProgress} transparent={true} >
                <View style={styles.progressContainer}>
                    <ProgressBar style={styles.ProgressBar} progress={progressValue} color={MD3Colors.primary50} />
                    <Text style={{ color: 'white', alignSelf: 'center' }}>Re-encrypting database. Do Not Close The App!</Text>
                </View>

            </Modal>
            <Notification
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    message='Master Key Updated'
            />
        </>

    );
}
const styles = StyleSheet.create({
    updateContainer: {
        margin: 20
    },
    loginBtn: {
        marginTop: 20,
        backgroundColor: customTheme.colors.inversePrimary
    },
    ProgressBar: {
        marginTop: '50%',
        marginHorizontal: 20,
        alignSelf: 'center'
    },
    progressContainer: {
        height: '100%',
        padding: 20,
        backgroundColor: customTheme.colors.inverseSurface,
        opacity: 0.8,
    }
});

export default Settings;
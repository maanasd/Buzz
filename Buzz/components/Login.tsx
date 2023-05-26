import React, { useEffect } from 'react';
import { Button, TextInput, Provider as PaperProvider, Text } from "react-native-paper";
import {
    View,
    SafeAreaView,
    StyleSheet,
    Image
} from 'react-native';
import customTheme from '../buzzTheme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MasterKey from '../model/MasterKey';
import md5 from 'md5';
import Notification from './Notification';
import Encryption from '../model/Encryption';
// add type safety to navigation props
type StackParamList = {
    Login: undefined;
    Home: undefined;
};

type LoginScreenNavigationProp = NativeStackScreenProps<
    StackParamList,
    'Login'
>;

type Props = {
    navigation: LoginScreenNavigationProp;
};


// navigate to home screen on button press
function Login({ navigation }: Props): JSX.Element {
    const [btnText, setBtnText] = React.useState<string>('Create Access');
    const [masterKey, setMasterKey] = React.useState<string>('');
    const [visible, setVisible] = React.useState<boolean>(false);
    function handleAccess(navigation: LoginScreenNavigationProp, key: string) {
        MasterKey.getMasterKey().then((key) => {
            if (key === null) {
                MasterKey.storeMasterKey(masterKey);
                // generate encryption key
                Encryption.generateKey(masterKey, md5(masterKey), 1000, 256).then((aesKey) => {
                    // store encryption key
                    Encryption.storeKey(aesKey);
                });
                navigation.navigate('Home');
            } else if (key === md5(masterKey)) {
                Encryption.generateKey(masterKey, md5(masterKey), 1000, 256).then((aesKey) => {
                    // store encryption key
                    Encryption.storeKey(aesKey);
                });
                navigation.navigate('Home');
            } else {
                setVisible(true);
            }
        })
    }
    useEffect(() => {
        // if no access key found set button text to Create Access
        // else set button text to Access
        MasterKey.getMasterKey().then((key) => {
            if (key === null) {
                setBtnText('Create Access');
            } else {
                setBtnText('Access');
            }
        })

    }, [])
    return (
        <PaperProvider theme={customTheme}>
            <SafeAreaView>
                <View style={styles.loginContainer}>
                    <Text variant='headlineMedium' style={styles.buzzTitle}>Buzz Password Manager</Text>
                    <Image style={styles.displayLogo} source={require('../image/Buzz-logo.png')} />
                    <View style={btnText === 'Access'? {display:'none'}:{display:"flex"}}>
                        <Text variant='bodyLarge' style={styles.buzzTitle}>Make note of your master key. You can't change it later.</Text>
                    </View>
                    <TextInput value={masterKey} onChangeText={setMasterKey} placeholder='Enter Master Key' label="Master Key" secureTextEntry={true} />
                    <Button style={styles.loginBtn} mode='contained' onPress={() => handleAccess(navigation, masterKey)}>{btnText}</Button>
                </View>

            </SafeAreaView>
            <Notification message='Incorrect Master Key' visible={visible} onDismiss={() => setVisible(false)} />
        </PaperProvider>

    )
}
const styles = StyleSheet.create({

    buzzTitle: {
        color: customTheme.colors.primary,
        alignSelf: 'center',
        margin: 5
    },
    loginContainer: {
        margin: 20
    },
    displayLogo: {
        width: 200,
        height: 200,
        margin: 20,
        alignSelf: 'center'
    },
    loginBtn: {
        margin: 20,
        backgroundColor: customTheme.colors.inversePrimary
    }
});

export default Login;
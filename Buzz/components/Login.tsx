import React, { useEffect } from 'react';
import { Button, TextInput, Provider as PaperProvider, Text, ProgressBar, MD3Colors } from "react-native-paper";
import {
    View,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Image,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
    Keyboard
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
    const [strengthLabel, setStrengthLabel] = React.useState<string>('Weak');
    const [strengthValue, setStrengthValue] = React.useState<number>(0);
    const [strengthColor, setStrengthColor] = React.useState<any>(MD3Colors.error50);
    const [notificationMsg, setNotificationMsg] = React.useState<string>('');
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 60
    function handleAccess(navigation: LoginScreenNavigationProp, key: string) {
        MasterKey.getMasterKey().then(async (key) => {
            if (masterKey === '') {
                setNotificationMsg('Please enter a master key');
                setVisible(true);
                return;
            }
            if (key === null) {
                await MasterKey.storeMasterKey(masterKey);
                // generate encryption key
                Encryption.generateKey(masterKey, md5(masterKey), 1000, 256).then((aesKey) => {
                    // store encryption key
                    Encryption.storeKey(aesKey);
                });
                setBtnText('Access');
                navigation.navigate('Home');
            } else if (key === md5(masterKey)) {
                Encryption.generateKey(masterKey, md5(masterKey), 1000, 256).then((aesKey) => {
                    // store encryption key
                    Encryption.storeKey(aesKey);
                });
                navigation.navigate('Home');
            } else {
                setNotificationMsg('Incorrect master key');
                setVisible(true);
            }
        })
    }
    function handleMasterKeyUpdate(key: string) {
        setMasterKey(key);
        const score = MasterKey.estimateMasterKeyStrength(key);
        if (score === 0) {
            setStrengthLabel('Weak');
            setStrengthValue(0.25);
            setStrengthColor("red");
        } else if (score === 1 || score === 2) {
            setStrengthLabel('Fair');
            setStrengthValue(0.5);
            setStrengthColor("orange");
        } else {
            setStrengthLabel('Strong');
            setStrengthValue(1);
            setStrengthColor("green");
        }

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
            <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={keyboardVerticalOffset}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.loginContainer}>
                        <Text variant='headlineMedium' style={styles.buzzTitle}>Buzz Password Manager</Text>
                        <Image style={styles.displayLogo} source={require('../image/Buzz-logo.png')} />
                        <View style={btnText === 'Access' ? { display: 'none' } : { display: "flex" }}>
                            <Text variant='bodyLarge' style={styles.buzzTitle}>Make note of your master key. You can't change it later.</Text>
                        </View>
                        <TextInput value={masterKey} onChangeText={handleMasterKeyUpdate} placeholder='Enter Master Key' label="Master Key" secureTextEntry={true} />
                        {
                            (btnText === "Create Access") && <View style={styles.passStrength}>
                                <ProgressBar progress={strengthValue} color={strengthColor} />
                                <Text variant='bodyLarge' style={styles.buzzTitle}>Key strength is {strengthLabel}</Text>
                            </View>

                        }

                        <Button style={styles.loginBtn} mode='contained' onPress={() => handleAccess(navigation, masterKey)}>{btnText}</Button>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <Notification message={notificationMsg} visible={visible} onDismiss={() => setVisible(false)} />
        </PaperProvider>
    )
}
const styles = StyleSheet.create({
    passStrength: {
        width: '50%',
        alignSelf: 'center',
        margin: 10
    },
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
        margin: 10,
        alignSelf: 'center'
    },
    loginBtn: {
        margin: 10,
        backgroundColor: customTheme.colors.inversePrimary
    }
});

export default Login;
import React, { useEffect } from 'react';
import { Button, TextInput, Provider as PaperProvider } from "react-native-paper";
import {
    View,
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import customTheme from '../buzzTheme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MasterKey from '../model/MasterKey';
import md5 from 'md5';
import Notification from './Notification';
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
                navigation.navigate('Home');
            } else if (key === md5(masterKey)) {
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
                    <TextInput value={masterKey} onChangeText={setMasterKey} placeholder='Enter Master Key' label="Master Key" secureTextEntry={true} />
                    <Button style={styles.loginBtn} mode='contained' onPress={() => handleAccess(navigation, masterKey)}>{btnText}</Button>
                </View>

            </SafeAreaView>
            <Notification message='Incorrect Master Key' visible={visible} onDismiss={() => setVisible(false)} />
        </PaperProvider>

    )
}
const styles = StyleSheet.create({

    loginContainer: {
        margin: 20
    },
    loginBtn: {
        margin: 20
    }
});

export default Login;
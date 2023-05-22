
import React, { useEffect } from 'react';
import { Card, Title, Paragraph, TextInput, IconButton, Modal, Text, Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

type Props = {
    setPasswordText: (text: string) => void;
    password: string;

}

function PassInput(props: Props) {
    const [eyeIcon, setEyeIcon] = React.useState('eye');
    const [visibleEye, setVisibleEye] = React.useState<boolean>(true);

    function viewPass() {
        setEyeIcon(eyeIcon === 'eye' ? 'eye-off' : 'eye');
        setVisibleEye(!visibleEye);
    }

    return (
        <View style={styles.passFieldContainer}>
            <TextInput style={styles.passInput} onChangeText={props.setPasswordText} value={props.password} placeholder='Enter Password' label="Password" secureTextEntry={visibleEye} />
            <IconButton style={styles.viewIcon} iconColor='black' icon={eyeIcon} size={24} onPress={() => viewPass()} />
        </View>
    )
}

const styles = StyleSheet.create({
    passFieldContainer: {
        flexDirection: 'row',
        width: '100%',
    },
    viewIcon: {
        margin: 0,
        marginTop: 10,
    },
    passInput: {
        width: '80%',
        margin: 5,
    }

});


export default PassInput;
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Title, Paragraph, TextInput, IconButton, Modal, Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import Notification from './Notification';
type Props = {

    url: string;
    username: string;
    password: string;
    btnKey: number;
    showDeleteModal: () => void;
    showEditModal: () => void;
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: 'black',
        margin: 8,
        flexDirection: 'row',

    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    icon: {
        marginRight: 16,
    },
    passInfoContainer: {
        flexDirection: 'column',
        width: '80%',
    },
    dataFieldContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    passField: {
        height: 30,
        flex: 1,
        marginTop: 6,
        width: '100%',
    },
    viewIcon: {
        margin:0
    },
    passFieldContainer: {
        flexDirection: 'row',
    },
    editDeleteContainer: {
        flexDirection: 'row',
        alignContent: 'flex-start',
    },
    deleteIcon: {
        marginLeft: 0,
    },
    editIcon: {
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        width: '80%',
        alignSelf: 'center',
        zIndex: 3
    },
    containerBtn: {
        margin: 5
    }
});



function PassCard(props: Props): JSX.Element {
    const { url, username, password } = props;
    const [eyeIcon, setEyeIcon] = React.useState('eye');
    const [visible, setVisible] = React.useState(true);

    function viewPass(){
        setEyeIcon(eyeIcon === 'eye'? 'eye-off': 'eye');
        setVisible(!visible);
    }
    function copyPass(pass: string) {
        Clipboard.setString(pass);
    }
    return (
        <>
            <Card style={styles.container}>
                <Card.Content style={styles.content}>
                    <Icon name="form-textbox-password" size={24} style={styles.icon} />
                    <View style={styles.passInfoContainer}>
                        <Title>{url}</Title>
                        <View style={styles.dataFieldContainer}>
                            <TextInput
                                style={styles.passField}
                                disabled={true}
                                secureTextEntry={false}
                                value={username}
                            />
                            <View style={styles.passFieldContainer}>
                                <TextInput
                                    style={styles.passField}
                                    disabled={true}
                                    secureTextEntry={visible}
                                    value={password}
                                />
                                {/* Use Icon button */}
                                <IconButton style={styles.viewIcon} iconColor='black' icon={eyeIcon} size={24} onPress={() => viewPass() } />
                                <IconButton style={styles.viewIcon} iconColor='black' icon="content-copy" size={24} onPress={() => copyPass(props.password)} />
                            </View>

                        </View>
                        <View style={styles.editDeleteContainer}>
                            <IconButton style={styles.deleteIcon} iconColor='red' icon="trash-can-outline" size={24} onPress={() => props.showDeleteModal()} />
                            <IconButton key={props.btnKey} style={styles.editIcon} iconColor='green' icon="pencil" size={24} onPress={() => props.showEditModal()} />
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </>

    );
}


export default PassCard;
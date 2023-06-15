/**
 * Buzz Password Manager
 */

import React, { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import {

    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';

import customTheme from '../buzzTheme';
import {
    FAB, Provider as PaperProvider, Appbar, List,
    Portal, Button, Modal, Text, TextInput, Searchbar,
    Snackbar, IconButton
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PassCard from './PassCard';
import DatabaseHandler from '../model/Credential';
import Notification from './Notification';
import { StackActions } from '@react-navigation/routers';
import Encryption from '../model/Encryption';
import Clipboard from '@react-native-clipboard/clipboard';
type EditData = {
    url: string;
    username: string;
    password: string;
    id: number;
}

type AddData = {
    url: string;
    username: string;
    password: string;
}

// This function generates a random password
function generatePasswordString(): string {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

function Home({ navigation }: { navigation: any }): JSX.Element {
    const [visible, setVisible] = React.useState<boolean>(false);
    const [deleteVisible, setDeleteVisible] = React.useState<boolean>(false);
    const [deleteId, setDeleteId] = React.useState<number>(-1);
    const [addData, setAddData] = React.useState<AddData>({ url: '', username: '', password: '' });
    const [searchText, setSearchText] = React.useState<string>('');
    const [passData, setPassData] = React.useState<any[]>([]);
    const [snackbarVisible, setSnackbarVisible] = React.useState<boolean>(false);
    const [snackMessage, setSnackMessage] = React.useState<string>('');
    // combine the edit text into a signle object state
    const [editData, setEditData] = React.useState<EditData>({ url: '', username: '', password: '', id: -1 });
    const [editVisible, setEditVisible] = React.useState<boolean>(false);
    const [eyeIcon, setEyeIcon] = React.useState('eye');
    const [visibleEye, setVisibleEye] = React.useState<boolean>(true);
    const [encryptionKey, setEncryptionKey] = React.useState<string>('');
    const db = new DatabaseHandler();
    useEffect(() => {
        Encryption.getKey().then((key) => {
            setEncryptionKey(key!);
            db.createTable();
            db.getAllData((data: any) => setPassData(data), key!);
        });

    }, []);

    const showModal = () => setVisible(true);
    function hideModal() {
        setVisible(false);
        setAddData({ url: '', username: '', password: '' });
    }
    const hideDeleteModal = () => setDeleteVisible(false);
    function showDeleteModal(id: number) {
        setDeleteId(id);
        setDeleteVisible(true);
    }
    function setUrlEditText(text: string) {
        setEditData({ ...editData, url: text });
    }
    function setUsernameEditText(text: string) {
        setEditData({ ...editData, username: text });
    }
    function setPasswordEditText(text: string) {
        setEditData({ ...editData, password: text });
    }

    function hideEditModal() {
        setEditVisible(false);
        setEditData({ url: '', username: '', password: '', id: -1 });
    }

    function showEditModal(editData: EditData) {
        setEditData(editData);
        setEditVisible(true);
    }

    function deleteCredential(): void {
        db.deleteData(deleteId);
        filterCredential(searchText);
        hideDeleteModal();
    }

    function viewPass() {
        setEyeIcon(eyeIcon === 'eye' ? 'eye-off' : 'eye');
        setVisibleEye(!visibleEye);
    }


    function filterCredential(text: string): void {
        setSearchText(text);
        Encryption.getKey().then(async (key) => {
            if (text === '')
                db.getAllData((data: any) => setPassData(data), key!);
            else {
                db.filterData(text, (data: any) => setPassData(data), key!);
            }
        });


    }

    async function editCredential(): Promise<void> {
        if (Object.values(editData).includes('')) {
            setSnackMessage('No field can be empty');
            setSnackbarVisible(true);
            return;
        }
        Encryption.getKey().then(async (key) => {
            const encryptedPassword = JSON.stringify(await Encryption.encryptData(editData.password, key!));
            db.updateData(editData.id, editData.url, editData.username, encryptedPassword, () => {
                setSnackMessage('Credential updated');
                setSnackbarVisible(true);
            });
            filterCredential(searchText);
            hideEditModal();
        })


    }

    async function addCredential(url: string, username: string, password: string): Promise<void> {
        if (url === '' || username === '' || password === '') {
            setSnackMessage('No field can be empty');
            setSnackbarVisible(true);
            return;
        }
        Encryption.getKey().then(async (key) => {
            const encryptedPassword: string = JSON.stringify(await Encryption.encryptData(password, key!));
            db.insertData(url, username, encryptedPassword);
            filterCredential(searchText);
            hideModal();
            setAddData({ url: '', username: '', password: '' });
        });
    }

    function setUrlText(text: string) {
        setAddData({ ...addData, url: text });
    }
    function setUserNameText(text: string) {
        setAddData({ ...addData, username: text });
    }
    function setPasswordText(text: string) {
        setAddData({ ...addData, password: text });
    }

    function generatePassword() {
        const password = generatePasswordString();
        setAddData({ ...addData, password: password });
    }

    return (
        <PaperProvider theme={customTheme}>
            <SafeAreaView style={styles.container}>

                <Searchbar onChangeText={filterCredential} style={styles.searchBar} placeholder='Search for credentials' value={searchText} />
                <ScrollView style={styles.passContainer}>
                    {passData !== undefined && passData.map((item: any) => {
                        return <PassCard
                            btnKey={item}
                            showDeleteModal={() => showDeleteModal(item.id)}
                            showEditModal={() => showEditModal({ url: item.url, username: item.username, password: item.password, id: item.id })}
                            key={item.id}
                            url={item.url}
                            username={item.username}
                            password={item.password}
                        />
                    })}
                </ScrollView>
                <FAB
                    icon="plus"
                    style={styles.fab}
                    onPress={() => showModal()}
                />
                {/* Add modal */}
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
                    <TextInput autoCapitalize='none' autoCorrect={false} style={styles.containerInput} onChangeText={setUrlText} value={addData.url} placeholder='Enter URL' label="URL" />
                    <TextInput autoCapitalize='none' autoCorrect={false} style={styles.containerInput} onChangeText={setUserNameText} value={addData.username} placeholder='Enter Username' label="Username" />
                    <View style={styles.passFieldContainer}>
                        <TextInput autoCapitalize='none' autoCorrect={false} style={styles.passInput} onChangeText={setPasswordText} value={addData.password} placeholder='Enter Password' label="Password" secureTextEntry={visibleEye} />
                        <IconButton style={styles.viewIcon} iconColor='black' icon={eyeIcon} size={24} onPress={() => viewPass()} />
                        <IconButton style={styles.generateIcon} iconColor='black' icon={'refresh'} size={24} onPress={generatePassword} />
                    </View>

                    <Button buttonColor={customTheme.colors.inversePrimary} style={styles.containerBtn} mode="contained" onPress={async () => await addCredential(addData.url, addData.username, addData.password)}> Add </Button>
                    <Button style={styles.containerBtn} mode="contained" onPress={() => hideModal()}> Cancel </Button>
                </Modal>


                {/* Delete modal */}

                <Modal visible={deleteVisible} onDismiss={hideDeleteModal} contentContainerStyle={styles.containerStyle}>
                    <Text style={{ fontSize: 15, margin: 5 }} variant='labelSmall'>Are you sure you want to delete credential?</Text>
                    <Button buttonColor={customTheme.colors.inversePrimary} style={styles.containerBtn} mode="contained" onPress={() => deleteCredential()}> Delete </Button>
                    <Button buttonColor={customTheme.colors.secondary} style={styles.containerBtn} mode="contained" onPress={() => hideDeleteModal()}> Cancel </Button>
                </Modal>


                {/* Edit modal */}

                <Modal visible={editVisible} onDismiss={hideEditModal} contentContainerStyle={styles.containerStyle}>
                    <TextInput autoCapitalize='none' autoCorrect={false} style={styles.containerInput} onChangeText={setUrlEditText} value={editData.url} placeholder='Enter URL' label="URL" />
                    <TextInput autoCapitalize='none' autoCorrect={false} style={styles.containerInput} onChangeText={setUsernameEditText} value={editData.username} placeholder='Enter Username' label="Username" />
                    <View style={styles.passFieldContainer}>
                        <TextInput autoCapitalize='none' autoCorrect={false} style={styles.passInput} onChangeText={setPasswordEditText} value={editData.password} placeholder='Enter Password' label="Password" secureTextEntry={visibleEye} />
                        <IconButton style={styles.viewIcon} iconColor='black' icon={eyeIcon} size={24} onPress={() => viewPass()} />
                    </View>

                    <Button buttonColor={customTheme.colors.inversePrimary} style={styles.containerBtn} mode="contained" onPress={async () => await editCredential()}> Save </Button>
                    <Button style={styles.containerBtn} mode="contained" onPress={() => hideEditModal()}> Cancel </Button>
                </Modal>

            </SafeAreaView>
            <Notification
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                message={snackMessage}
            />
        </PaperProvider >

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 16,
        bottom: 16,
    },
    passContainer: {
        margin: 5
    },
    appBar: {
        flexDirection: 'row',
        backgroundColor: '#F2CD5D',
    },
    appBarIcon: {
        marginRight: 8
    },
    containerStyle: {
        backgroundColor: 'white',
        padding: 20,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10
    },
    containerBtn: {
        margin: 5
    },
    containerInput: {
        margin: 5,
    },
    searchBar: {
        margin: 5
    },
    passFieldContainer: {
        flexDirection: 'row',
        width: '100%',
    },
    viewIcon: {
        margin: 0,
        marginLeft: -5,
        marginTop: 10,
    },
    generateIcon: {
        marginRight: 40,
        marginLeft: -10,
        marginTop: 10,
    },
    passInput: {
        width: '80%',
        margin: 5,
    }

});

export default Home;

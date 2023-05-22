/**
 * Buzz Password Manager
 * https://github.com/facebook/react-native
 *
 * @format
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

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
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

function Home(): JSX.Element {
    const [visible, setVisible] = React.useState<boolean>(false);
    const [deleteVisible, setDeleteVisible] = React.useState<boolean>(false);
    const [deleteId, setDeleteId] = React.useState<number>(-1);
    const [addData, setAddData] = React.useState<AddData>({ url: '', username: '', password: '' });
    const [searchText, setSearchText] = React.useState<string>('');
    const [passData, setPassData] = React.useState<any[]>([]);
    const [snackbarVisible, setSnackbarVisible] = React.useState<boolean>(false);
    // combine the edit text into a signle object state
    const [editData, setEditData] = React.useState<EditData>({ url: '', username: '', password: '', id: -1 });
    const [editVisible, setEditVisible] = React.useState<boolean>(false);
    const [eyeIcon, setEyeIcon] = React.useState('eye');
    const [visibleEye, setVisibleEye] = React.useState<boolean>(true);
    const db = new DatabaseHandler();
    useEffect(() => {
        db.createTable();
        db.getAllData((data: any) => setPassData(data));
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
        // setUrlEditText('');
        // setUsernameEditText('');
        // setPasswordEditText('');
    }

    function showEditModal(editData: EditData) {
        // setDeleteId(id);
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
        if (text === '')
            db.getAllData((data: any) => setPassData(data));
        else {
            db.filterData(text, (data: any) => setPassData(data));
        }

    }

    function editCredential(): void {
        if (Object.values(editData).includes('')) {
            setSnackbarVisible(true);
            return;
        }
        db.updateData(editData.id, editData.url, editData.username, editData.password);
        filterCredential(searchText);
        hideEditModal();
    }

    function addCredential(url: string, username: string, password: string): void {
        if (url === '' || username === '' || password === '') {
            setSnackbarVisible(true);
            return;
        }
        db.insertData(url, username, password);
        filterCredential(searchText);
        hideModal();
        setAddData({ url: '', username: '', password: '' });
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

    return (
        <PaperProvider theme={customTheme}>
            <SafeAreaView style={styles.container}>
                <Appbar style={styles.appBar}>

                    <Appbar.Content title="Buzz Password Manager" />
                    {/* TODO: BLE sync feature coming in next release  */}
                    {/* <Icon name="bluetooth" size={24} style={styles.appBarIcon} /> */}

                </Appbar>
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
                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
                        <TextInput style={styles.containerInput} onChangeText={setUrlText} value={addData.url} placeholder='Enter URL' label="URL" />
                        <TextInput style={styles.containerInput} onChangeText={setUserNameText} value={addData.username} placeholder='Enter Username' label="Username" />
                        <View style={styles.passFieldContainer}>
                            <TextInput style={styles.passInput} onChangeText={setPasswordText} value={addData.password} placeholder='Enter Password' label="Password" secureTextEntry={visibleEye} />
                            <IconButton style={styles.viewIcon} iconColor='black' icon={eyeIcon} size={24} onPress={() => viewPass()} />
                        </View>

                        <Button buttonColor={customTheme.colors.inversePrimary} style={styles.containerBtn} mode="contained" onPress={() => addCredential(addData.url, addData.username, addData.password)}> Add </Button>
                        <Button style={styles.containerBtn} mode="contained" onPress={() => hideModal()}> Cancel </Button>
                    </Modal>
                    <Notification
                        visible={snackbarVisible}
                        onDismiss={() => setSnackbarVisible(false)}
                        message='No field can be empty'
                    />
                </Portal>
                {/* Delete modal */}
                <Portal>
                    <Modal visible={deleteVisible} onDismiss={hideDeleteModal} contentContainerStyle={styles.containerStyle}>
                        <Text style={{ fontSize: 15, margin: 5 }} variant='labelSmall'>Are you sure you want to delete credential?</Text>
                        <Button buttonColor={customTheme.colors.inversePrimary} style={styles.containerBtn} mode="contained" onPress={() => deleteCredential()}> Delete </Button>
                        <Button buttonColor={customTheme.colors.secondary} style={styles.containerBtn} mode="contained" onPress={() => hideDeleteModal()}> Cancel </Button>
                    </Modal>
                </Portal>

                {/* Edit modal */}
                <Portal>
                    <Modal visible={editVisible} onDismiss={hideEditModal} contentContainerStyle={styles.containerStyle}>
                        <TextInput style={styles.containerInput} onChangeText={setUrlEditText} value={editData.url} placeholder='Enter URL' label="URL" />
                        <TextInput style={styles.containerInput} onChangeText={setUsernameEditText} value={editData.username} placeholder='Enter Username' label="Username" />
                        <View style={styles.passFieldContainer}>
                            <TextInput style={styles.passInput} onChangeText={setPasswordEditText} value={editData.password} placeholder='Enter Password' label="Password" secureTextEntry={visibleEye} />
                            <IconButton style={styles.viewIcon} iconColor='black' icon={eyeIcon} size={24} onPress={() => viewPass()} />
                        </View>

                        <Button buttonColor={customTheme.colors.inversePrimary} style={styles.containerBtn} mode="contained" onPress={() => editCredential()}> Save </Button>
                        <Button style={styles.containerBtn} mode="contained" onPress={() => hideEditModal()}> Cancel </Button>
                    </Modal>
                </Portal>
            </SafeAreaView>

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
    },
    appBarIcon: {
        marginRight: 8,
        color: 'blue'
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
        marginTop: 10,
    },
    passInput: {
        width: '80%',
        margin: 5,
    }

});

export default Home;


import {
    FAB, Provider as PaperProvider, Appbar, List,
    Portal, Button, Modal, Text, TextInput, Searchbar,
    Snackbar, IconButton
} from 'react-native-paper';


type Props = {
    message: string;
    onDismiss: () => void;
    visible: boolean;
}

function Notification(props: Props): JSX.Element {
    return (
        <Snackbar
            visible={props.visible}
            onDismiss={props.onDismiss}
            action={{
                label: 'Dismiss',
                onPress: props.onDismiss
            }}
            duration={3000}
        >
            {props.message}
        </Snackbar>
    );
}

export default Notification;
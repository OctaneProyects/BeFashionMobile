import React,{useState} from 'react'
import { View, SafeAreaView, StyleSheet, Text } from 'react-native'
import { CheckBox } from 'react-native-elements';
import { Heading } from '../components/Heading';


export function FinalizaRuta({ navigation }) {
    const [entMercancia, setEntMerc] = useState(false);
    const [entDevolucion, setEntDev] = useState(false);
    return (
        <SafeAreaView>
            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={entMercancia}
                    onValueChange={setEntMerc}
                    style={styles.checkbox}
                />
                <Text style={styles.label}>Entrada de merca por veh </Text>
            </View>
            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={entDevolucion}
                    onValueChange={setEntDev}
                    style={styles.checkbox}
                />
                <Text style={styles.label}>Entrada por devolucion</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        alignContent: 'space-around',
    },
    comentsContainer: {
        paddingHorizontal: '7%',
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignContent: 'flex-end',
        justifyContent: 'space-around',
    },
    checkbox: {
        alignSelf: 'center',
    },
    label: {
        margin: 8,
        width: 250,
    },
    textInput: {
        backgroundColor: 'white',
    },
    btnSubmit: {
        marginTop: 40,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: 'blue',
    },
    btnSubmitContainer: {
        padding: 20,
    },
    btnSubmitText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
});


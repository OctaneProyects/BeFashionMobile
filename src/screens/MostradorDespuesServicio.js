import React, { useState } from 'react'
import { SafeAreaView, View, StyleSheet, Text, Image } from 'react-native'
import * as ImagePicker from 'react-native-image-picker';
import { FilledButton } from '../components/Button';
import { Heading } from '../components/Heading';
import { IconButton } from '../components/IconButton';
import Icon from 'react-native-vector-icons/FontAwesome'

export function MostradorDespuesServicio({ navigation }) {
    const [filePathM, setFilePathM] = useState("FileM");
    const [filePathM3, setFilePathM3] = useState("FileM3");
    const [enviar, setEnviar] = useState(0);

    launchCamera = (tipo) => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchCamera(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };
                console.log('response', JSON.stringify(JSON.stringify(response)).uri);
                if (tipo == 1) {
                    setFilePathM(response.assets[0].uri)
                } else if (tipo == 2) {
                    setFilePathM3(response.assets[0].uri)
                }

            }
        });

    }

    return (
        <SafeAreaView>
            <View
                style={styles.container1}>

                <IconButton
                    name='camera'
                    onPress={() => launchCamera(1)}
                />
                <Image
                    resizeMode="cover"
                    resizeMethod="scale"
                    style={{ width: "10%", height: "50%", marginLeft: 20 }}
                    source={{ uri: filePathM }}>
                </Image>
            </View>

            <View
                style={styles.container}>

                <IconButton
                    style={styles.button}
                    title={'Mostrador 3 metros'}
                    onPress={() => launchCamera(2)}
                />
                <Image
                    resizeMode="cover"
                    resizeMethod="scale"
                    style={{ width: '10%', height: '50%', marginLeft: 20 }}
                    source={{ uri: filePathM3 }}>

                </Image>
            </View>
            <View style={styles.container2}>
                <FilledButton
                    title='Siguiente'
                    style={{ marginVertical: 20, alignContent: 'center', width: '100%' }}
                    onPress={enviar === 0 ? ()=>alert('Carga imagenes') : () => {/*Llamada api para guardar*/ }}
                />
            </View>


        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    container1: {
        flexDirection: 'row',
        padding: 32,
        paddingTop: 120,
        alignItems: 'center',

    },
    container2: {

        padding: 5,

        alignItems: 'center',

    },
    container: {
        flexDirection: 'row',
        padding: 32,
        alignItems: 'center',

    },
    title: {
        paddingBottom: 50,
        color: 'white'

    },
    input: {
        marginVertical: 8,
    },
    button:
    {
        alignContent: 'center',
        marginVertical: 20,
        width: '80%'
    }
})
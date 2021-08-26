import React, { useState } from 'react'
import { SafeAreaView, View, StyleSheet, Text } from 'react-native'
import * as ImagePicker from 'react-native-image-picker';
import { FilledButton } from '../components/Button';
import Icon from 'react-native-vector-icons/FontAwesome'


export function MostradorAntesServicio({ navigation }) {
    const [filePath, setFilePath] = useState(null);
    const [enviar, setEnviar] = useState(0);
    launchCamera = () => {
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
                console.log('response', JSON.stringify(response));
                setFilePath(response.uri)
            }
        });

    }

    return (
        <SafeAreaView>

            <View
                style={ styles.container }>
                <Text style={{ padding: 20, fontWeight: 'bold' }}>
                    Segundo paso: Al llegar a la tienda tomar foto con caracteristicas X
                </Text>
                <Text>
                    Tome una foto antes de comenzar a surtir el exibidor
                </Text>
                <View style={styles.row}>
                    <Text style={{paddingRight:8}}>
                        Imagen mostrador:
                    </Text>
                    <Icon
                        name="camera"
                        size={25}
                        color="gray"
                        padding={20}
                        onPress={() => launchCamera()}
                    />
                </View>

            </View>
            <View style={styles.row}>
                <FilledButton
                    title='Siguiente'
                    style={{ marginVertical: 20, alignContent: 'center', width: '100%' }}
                    onPress={enviar === 0 ? () => navigation.navigate('Formulario') : () => {/*Llamada api para guardar*/ }}
                />
            </View>


        </SafeAreaView >
    );
}



const styles = StyleSheet.create({
    container: {
        padding: 32,
        paddingTop: 120,
        alignItems: 'center',

    },
    row: {
        flexDirection: 'row'
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
        width: '100%'
    }
})
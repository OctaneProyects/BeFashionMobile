import React, { useState } from 'react'
import {
    View, SafeAreaView, StyleSheet, Text, TextInput, Button
} from 'react-native'
import { CheckBox } from 'react-native-elements';
import { Heading } from '../components/Heading';

async function insertkm(km, imagen64, IdUsuario) {

    if (!km) {
        Alert.alert(
            "Verifique los datos",
            "Agregue un kilometraje final",
        );
        return;
    }
    if (!imagen64) {
        Alert.alert(
            "Verifique los datos",
            "Adjunte una imagen del odómetro",
            [

                { text: "Aceptar" }
            ]
        );
        return;
    }

    const viaje = {
        IdRuta: 1, //agregar

        IdUsuario: IdUsuario,
        KmFinal: km,
        IdEstatus: 1, //agregar
        Imagen: imagen64,
    };
    console.log(viaje);

    const result = await axios.post(
        `${BASE_URL}vehiculos/InsertaKmInicial`,
        viaje,
    );
    if (result.data == 'ok') {
        Alert.alert(
            "Listo",
            "Se han registrado correctamente",
            [

                { text: "Continuar", onPress: () => navigation.navigate('Home') }
            ]
        );
    } else {
        alert('error');
    }
    console.log(result.data);

    return result;


}



export function FinalizaRuta({ navigation }) {

    const [entMercancia, setEntMerc] = useState(false);
    const [entDevolucion, setEntDev] = useState(false);

    const [totalPz, setTotalPz] = usesState(0);
    const [vehiculo, setVehiculo] = usesState("0");
    const [kmInicial, setKmInicial] = usesState(0);
    const [kmFinal, setKmFinal] = usesState(0);
    const [hrInicial, setHrInicial] = usesState("0");
    const [hrFinal, setHrFinal] = usesState("0");
    const [pzVendidas, setPzVendidas] = usesState(0);
    const [pzDanadas, setPzDanadas] = usesState(0);
    const [pzDefectuosa, setPzDefectuosa] = usesState(0);
    const [visitasDiarias, setVisitasDiarias] = usesState(0);
    const [visitasEfectivas, setVisitasEfectivas] = usesState(0);
    const [promocion, setPromocion] = usesState(0);


    const terminaRuta = () => {

    };

    return (
        <SafeAreaView>
            <View style={{ paddingTop: 10 }}>
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
            </View>
            <View style={{ paddingLeft: 70, paddingRight: 10, alignContent: "center" }}>
                <View>

                    <Text>

                        {totalPz} Total de piezas en carro
                    </Text>
                </View>
                <View>

                    <Text>
                        {vehiculo} No. Vehiculo
                    </Text>
                </View>
                <View>

                    <Text>
                        {kmInicial} KM inicial
                    </Text>
                </View>

                <View>
                    <TextInput></TextInput>
                    <Text>
                        {kmFinal} KM final
                    </Text>
                </View>
                <View>
                    <TextInput></TextInput>
                    <Text>
                        {hrInicial} Hora de salida
                    </Text>
                </View>

                <View>
                    <TextInput></TextInput>


                    <Text>
                        {hrFinal} Hora de llegada
                    </Text>
                </View>

                <View>

                    <Text>
                        {pzVendidas} Piezas vendidas
                    </Text>
                </View>

                <View>

                    <Text>

                        {pzDanadas} Piezas dañadas
                    </Text>
                </View>

                <View>

                    <Text>
                        {pzDefectuosa} Defectuosas de fabrica
                    </Text>
                </View>

                <View>

                    <Text>
                        {visitasDiarias} Visita diaria
                    </Text>
                </View>

                <View>

                    <Text>
                        {visitasEfectivas} Visitas efectivas
                    </Text>
                </View>

                <View>

                    <Text>
                        {promocion} Promocion
                    </Text>
                </View>


            </View>
            <View style={{ paddingTop: 70, paddingLeft: 70, paddingRight: 70, alignContent: "center" }}>
                <Button title={"Terminar"} style={styles.btnSubmit}>

                </Button>
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
        backgroundColor: 'rgb(27,67,136)'
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

